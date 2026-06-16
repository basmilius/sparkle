# Neural Network API

## `NeuralNetwork`

Extends [`Effect`](./layered#effect-tconfig).

### Factory Function

```typescript
createNeuralNetwork(config?: NeuralNetworkConfig)
```

### Methods

See [`Effect`](./layered#effect-tconfig) for the full method reference: `mount()`, `start()`, `pause()`, `resume()`, `configure()`, `withFade()`, and `destroy()`.

---

## `NeuralNetworkConfig`

```typescript
interface NeuralNetworkConfig {
    speed?: number;
    neurons?: number;
    color?: string;
    pulseColor?: string;
    connectionDistance?: number;
    scale?: number;
}
```

| Property             | Type     | Default      | Description                                                                       |
|----------------------|----------|--------------|-----------------------------------------------------------------------------------|
| `speed`              | `number` | `1`          | Animation speed multiplier, affects firing rate and pulse speed.                  |
| `neurons`            | `number` | `16`         | Number of neuron cells in the network.                                            |
| `color`              | `string` | `'#4488ff'`  | Color of dendrite arms and inter-cell connection threads.                         |
| `pulseColor`         | `string` | `'#88ccff'`  | Color of the glowing synaptic pulse particles.                                    |
| `connectionDistance` | `number` | `0`          | Maximum distance in pixels for drawing connections between neurons. `0` auto-derives from canvas size. |
| `scale`              | `number` | `1`          | Global scale factor for soma radii and arm thicknesses.                           |
