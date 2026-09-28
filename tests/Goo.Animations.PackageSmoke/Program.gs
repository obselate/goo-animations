package Goo.Animations.PackageSmoke

import Goo
import Goo.Animations
import System

internal class AnimationSmokeCell : Cell {
    internal let Value Anim[float64]

    init() {
        Value = Animate(2.0)
    }
}

func Require(condition bool, message string) {
    if !condition {
        throw InvalidOperationException(message)
    }
}

func Main() {
    let spec = Cubic.Tween(0.25)
    Require(spec.Duration == 0.25, "Cubic tween duration was not preserved.")

    let simulation = spec.Factory(2.0, 10.0, 0.0)
    Require(simulation.Position(-1.0) == 2.0, "Simulation lost its initial position.")
    Require(
        Math.Abs(simulation.Position(0.125) - 6.0) < 0.000001,
        "Packaged cubic simulation produced the wrong midpoint."
    )
    Require(simulation.Done(0.25) && simulation.Position(0.25) == 10.0, "Goo simulation did not finish at the target.")

    let owner = AnimationSmokeCell{}
    owner.Value.To(10.0, spec)
    Require(owner.Value.Running && owner.Value.Target == 10.0, "Packaged Anim.To did not bind the motion target.")
    owner.Value.Snap(4.0)
    Require(!owner.Value.Running && owner.Value.Value == 4.0, "Packaged Anim.Snap did not stop at the supplied value.")

    let timeline = Timeline(owner)
    timeline.Run(0.1, () -> { })
    timeline.Hold(0.05)
    timeline.Loop()
    timeline.Stop()
    Require(!timeline.Running, "Packaged Timeline.Stop did not stop the timeline.")

    Console.WriteLine("PASS: Goo.Animations package motion ABI.")
}
