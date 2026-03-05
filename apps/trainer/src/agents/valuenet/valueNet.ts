import * as tf from "@tensorflow/tfjs-node";
import type { Grid } from "@zvi/ai-2048-core";
import { VALUE_NET_INPUT_SHAPE, encodeGrid } from "./encode.js";

export type ValueNetModel = tf.LayersModel;

export type CreateValueNetConfig = {
  learningRate?: number;
};

export function createValueNet(cfg: CreateValueNetConfig = {}): ValueNetModel {
  const learningRate = cfg.learningRate ?? 0.001;

  const model = tf.sequential({
    layers: [
      tf.layers.inputLayer({ inputShape: [...VALUE_NET_INPUT_SHAPE] }),
      tf.layers.flatten(),
      tf.layers.dense({ units: 128, activation: "relu" }),
      tf.layers.dense({ units: 64, activation: "relu" }),
      tf.layers.dense({ units: 1, activation: "linear" }),
    ],
  });

  model.compile({
    optimizer: tf.train.adam(learningRate),
    loss: "meanSquaredError",
  });

  return model;
}

export async function loadValueNet(modelJsonPath: string): Promise<ValueNetModel> {
  const url = modelJsonPath.startsWith("file://")
    ? modelJsonPath
    : `file://${modelJsonPath}`;
  return tf.loadLayersModel(url);
}

export async function saveValueNet(model: ValueNetModel, outDirAbs: string): Promise<void> {
  await model.save(`file://${outDirAbs}`);
}

export function predictV(model: ValueNetModel, grid: Grid): number {
  return tf.tidy(() => {
    const x = tf.tensor4d(encodeGrid(grid), [1, ...VALUE_NET_INPUT_SHAPE]);
    const y = model.predict(x) as tf.Tensor;
    const v = y.dataSync()[0];
    return Number(v);
  });
}

export function predictBatch(model: ValueNetModel, grids: Grid[]): number[] {
  if (grids.length === 0) return [];

  return tf.tidy(() => {
    const batch = new Float32Array(grids.length * 16);
    let offset = 0;

    for (const g of grids) {
      const enc = encodeGrid(g);
      batch.set(enc, offset);
      offset += enc.length;
    }

    const x = tf.tensor4d(batch, [grids.length, ...VALUE_NET_INPUT_SHAPE]);
    const y = model.predict(x) as tf.Tensor;
    const vals = y.dataSync();
    return Array.from(vals, (v) => Number(v));
  });
}

export async function trainOnSample(
  model: ValueNetModel,
  grid: Grid,
  target: number,
): Promise<number> {
  const xs = tf.tensor4d(encodeGrid(grid), [1, ...VALUE_NET_INPUT_SHAPE]);
  const ys = tf.tensor2d([target], [1, 1]);

  try {
    const out = await model.trainOnBatch(xs, ys);
    const loss = Array.isArray(out) ? out[0] : out;
    return Number(loss);
  } finally {
    xs.dispose();
    ys.dispose();
  }
}
