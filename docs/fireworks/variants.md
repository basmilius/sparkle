# Firework Variants

There are 16 unique firework variants, each with distinct visual characteristics.

## Classic

### Peony
Classic spherical burst with round particles. The most common firework type.
- **Shape:** Circle
- **3D:** Yes

### Chrysanthemum
Dense burst with many long-trailing particles and sparkle effects.
- **Shape:** Line
- **3D:** Yes

### Willow
Particles fall gracefully with extremely long trails, creating a weeping willow effect.
- **Shape:** Line
- **Gravity:** High (1.5)

### Palm
Narrow upward cone that arcs into drooping trails, resembling a palm tree.
- **Shape:** Line
- **Gravity:** High (1.2)

### Brocade
Dense golden shimmer trails with sparkle. Always rendered in warm amber tones (hue 35-50).
- **Shape:** Line
- **Gravity:** High (1.3)

## Geometric

### Ring
Particles form a perfect circle using evenly distributed angles.
- **Shape:** Diamond

### Concentric
Two concentric rings at different sizes with complementary colors (hue +120).
- **Composite:** Outer ring (speed 7-10) + inner ring (speed 3-5)

### Saturn
A filled 3D sphere surrounded by a tilted elliptical ring with contrasting color (hue +60).
- **Composite:** Outer shell + filled interior + rotated elliptical ring with z-depth
- **Ring rotation:** Random per explosion

## Shapes

### Heart
Parametric heart curve: `x = 16sin³(t)`, `y = -(13cos(t) - 5cos(2t) - 2cos(3t) - cos(4t))`.
- **Shape:** Circle
- **Gravity:** Very low (0.3) to maintain shape
- **Tilt:** Slight random rotation (±0.3 rad)

### Flower
Rose curve `r = |cos(nθ)|` with 2-4 petals (4-8 visible lobes).
- **Shape:** Circle
- **Gravity:** Very low (0.3)

### Spiral
3-5 arms that spiral outward. Each arm has particles with increasing speed and angle offset, creating a galaxy/pinwheel pattern.
- **Shape:** Circle
- **Arms:** Subtle hue shift per arm

## Effects

### Crackle
Particles that create bright spark flashes when they die.
- **Shape:** Star (rotating 4-pointed)
- **Secondary effect:** 8 sparks per dying particle

### Crossette
Particles that split into 4 sub-explosions mid-flight (at alpha 0.5), creating a cross pattern.
- **Shape:** Circle
- **Secondary effect:** 4 peony sub-bursts per split

### Strobe
Particles that blink on/off (3 frames on, 3 frames off) at ~10Hz.
- **Shape:** Circle
- **3D:** Yes

### Horsetail
Narrow upward fountain with extreme gravity that creates a cascading waterfall effect.
- **Shape:** Line
- **Gravity:** Very high (2.0)
- **Speed:** High (8-14)

## Dahlia
Multi-colored petal clusters. 6-9 groups of particles with alternating hue offsets (±25).
- **Shape:** Circle
- **3D:** Yes
