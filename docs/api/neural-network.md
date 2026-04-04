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
    scale?: number;
}
```

| Property     | Type     | Default      | Description                                                     |
|--------------|----------|--------------|-----------------------------------------------------------------|
| `speed`      | `number` | `1`          | Animation speed multiplier, affects firing rate and pulse speed.|
| `neurons`    | `number` | `16`         | Number of neuron cells in the network.                          |
| `color`      | `string` | `'#4488ff'`  | Color of dendrite arms and inter-cell connection threads.       |
| `pulseColor` | `string` | `'#88ccff'`  | Color of the glowing synaptic pulse particles.                  |
| `scale`      | `number` | `1`          | Global scale factor for soma radii and arm thicknesses.         |

---

## Internal Types

### `NeuronCell`

```typescript
type NeuronCell = {
    x: number;
    y: number;
    somaRadius: number;
    brightness: number;
    glowTimer: number;
    fireTimer: number;
    fireInterval: number;
    arms: ArmSegment[];
    connections: number[];
};
```

### `ArmSegment`

```typescript
type ArmSegment = {
    toX: number;
    toY: number;
    cpX: number;
    cpY: number;
    thickness: number;
    children: ArmSegment[];
};
```

### `SynapticPulse`

```typescript
type SynapticPulse = {
    fromCell: number;
    toCell: number;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
    cpX: number;
    cpY: number;
    t: number;
};
```
