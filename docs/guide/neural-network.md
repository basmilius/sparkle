# Neural Network

The neural network effect renders a network of neurons with branching dendrite arms. Neurons fire spontaneously on a rhythmic cycle: when a cell fires, it lights up and sends synaptic pulses along its connections to neighboring cells, which in turn fire after the pulse arrives.

::: render
render=../code/neural-network/preview.vue
:::

## Examples

::: example Basic || Default neural network with blue neurons.
example=../code/neural-network/preview.vue
:::

## Configuration

```typescript
import { createNeuralNetwork } from '@basmilius/sparkle';

const network = createNeuralNetwork({
    speed: 1,
    neurons: 16,
    color: '#4488ff',
    pulseColor: '#88ccff',
    scale: 1
});
network.mount(canvas).start();
```

### Neuron Count

```typescript
// Sparse network, few connections
createNeuralNetwork({ neurons: 8 });

// Dense network, many interconnections
createNeuralNetwork({ neurons: 32 });
```

### Colors

`color` controls the dendrite arms and axon threads; `pulseColor` controls the glowing synaptic pulses:

```typescript
// Warm bioluminescent style
createNeuralNetwork({
    color: '#ff8833',
    pulseColor: '#ffcc88'
});

// Green circuit style
createNeuralNetwork({
    color: '#33ff88',
    pulseColor: '#aaffcc'
});
```

### Speed

```typescript
// Slow firing rhythm
createNeuralNetwork({ speed: 0.5 });

// Fast, active network
createNeuralNetwork({ speed: 2 });
```
