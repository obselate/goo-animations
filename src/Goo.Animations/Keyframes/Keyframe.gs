package Goo.Animations

import Goo

/// Describes one point in an authored scalar animation.
/// `Time` and `Progress` are normalized from zero through one. `Offset` is added
/// to the interpolated value. `Easing` controls the segment from this frame to the next.
public data struct Keyframe(Time float64, Progress float64, Offset float64, Easing Easing) { }
