package Goo.Animations.PackageSmoke

import Goo
import Goo.Animations
import System

internal class AnimationSmokeCell : Cell {
    internal let Value Anim[float64]
    internal var Builds int32

    init() {
        Value = Animate(2.0)
    }

    public override func Build() Blob {
        Builds++
        return Container{}
    }
}

internal open class AnimationSmokeHost : EmbeddedWindowHost {
    protected override func RequestFrame() { }

    protected override func LoadVulkanLibrary() bool -> throw NotSupportedException()

    protected override func GetVulkanGetInstanceProcAddr() nint -> throw NotSupportedException()

    protected override func UnloadVulkanLibrary() {
        throw NotSupportedException()
    }

    protected override func GetVulkanInstanceExtensions()[]string -> throw NotSupportedException()

    protected override func CreateVulkanSurface(instance nint, out surface uint64) bool {
        surface = 0uL
        throw NotSupportedException()
    }

    protected override func DestroyVulkanSurface(instance nint, surface uint64) {
        throw NotSupportedException()
    }
}

func Require(condition bool, message string) {
    if !condition {
        throw InvalidOperationException(message)
    }
}

func TimelineCompletionContract() {
    using let host = AnimationSmokeHost()
    host.UpdatePreferences(PlatformPreferences{ReducedMotion: true})
    let owner = AnimationSmokeCell{}
    let window = Window{Width: 100, Height: 100, Root: owner}
    window.Attach(host)
    host.RenderFrame(0.0)
    let initialBuilds = owner.Builds

    var first = 0
    var second = 0
    let timeline = Timeline(owner)
    timeline.Run(
        1.0,
        () -> {
            first++
        }
    )
    timeline.Hold(1.0)
    timeline.Run(
        1.0,
        () -> {
            second++
        }
    )
    timeline.Play()
    Require(first == 1 && timeline.Running, "Timeline.Play did not start its first action.")

    host.RenderFrame(0.0)
    Require(
        first == 1 && second == 0 && timeline.Running && owner.Builds == initialBuilds,
        "Reduced motion changed timeline action order or rebuilt its owner."
    )
    host.RenderFrame(0.0)
    Require(
        first == 1 && second == 1 && timeline.Running && owner.Builds == initialBuilds,
        "Reduced motion skipped an action or rebuilt its owner."
    )
    host.RenderFrame(0.0)
    Require(
        first == 1 && second == 1 && !timeline.Running && owner.Builds == initialBuilds,
        "Finite timeline did not stop after its final action or rebuilt its owner."
    )

    host.Dispose()
}

func TimelineReducedLoopContract() {
    using let host = AnimationSmokeHost()
    host.UpdatePreferences(PlatformPreferences{ReducedMotion: true})
    let owner = AnimationSmokeCell{}
    let window = Window{Width: 100, Height: 100, Root: owner}
    window.Attach(host)
    host.RenderFrame(0.0)

    var actions = 0
    let timeline = Timeline(owner)
    timeline.Run(
        1.0,
        () -> {
            actions++
        }
    )
    timeline.Hold(1.0)
    timeline.Loop()
    timeline.Play(window)
    Require(actions == 1 && timeline.Running, "Legacy Timeline.Play(Window) did not start the loop.")

    host.RenderFrame(0.0)
    host.RenderFrame(0.0)
    for var i = 0;
    i < 3;
    i++ {
        host.RenderFrame(0.0)
    }
    Require(actions == 1 && !timeline.Running, "Reduced motion did not stop a loop after its current iteration.")

    host.Dispose()
}

func TimelineNaturalCompletionContract() {
    using let host = AnimationSmokeHost()
    let owner = AnimationSmokeCell{}
    let window = Window{Width: 100, Height: 100, Root: owner}
    window.Attach(host)
    host.RenderFrame(0.0)
    let initialBuilds = owner.Builds

    var first = 0
    var second = 0
    let timeline = Timeline(owner)
    timeline.Run(
        0.0,
        () -> {
            first++
        }
    )
    timeline.Hold(0.0)
    timeline.Run(
        0.0,
        () -> {
            second++
        }
    )
    timeline.Play()
    Require(first == 1 && timeline.Running, "Zero-duration timeline did not start its first action.")
    host.RenderFrame(0.0)
    Require(first == 1 && second == 0 && timeline.Running, "Natural completion skipped a hold step.")
    host.RenderFrame(0.0)
    Require(first == 1 && second == 1 && timeline.Running, "Natural completion skipped or repeated an action.")
    host.RenderFrame(0.0)
    Require(
        first == 1 && second == 1 && !timeline.Running && owner.Builds == initialBuilds,
        "Natural completion did not stop or rebuilt the timeline owner."
    )

    host.Dispose()
}

func TimelineDisabledLoopContract() {
    let originalScale = Motion.TimeScale
    using let host = AnimationSmokeHost()
    let owner = AnimationSmokeCell{}
    let window = Window{Width: 100, Height: 100, Root: owner}
    window.Attach(host)
    host.RenderFrame(0.0)

    try {
        Motion.TimeScale = 0.0
        var actions = 0
        let timeline = Timeline(owner)
        timeline.Run(
            1.0,
            () -> {
                actions++
            }
        )
        timeline.Hold(1.0)
        timeline.Loop()
        timeline.Play()
        host.RenderFrame(0.0)
        host.RenderFrame(0.0)
        for var i = 0;
        i < 3;
        i++ {
            host.RenderFrame(0.0)
        }
        Require(actions == 1 && !timeline.Running, "Disabled motion did not stop a loop after its current iteration.")
    } finally {
        Motion.TimeScale = originalScale
        host.Dispose()
    }
}

func TimelineOwnerDisposalContract() {
    using let host = AnimationSmokeHost()
    let owner = AnimationSmokeCell{}
    let window = Window{Width: 100, Height: 100, Root: owner}
    window.Attach(host)
    host.RenderFrame(0.0)

    let timeline = Timeline(owner)
    timeline.Run(1.0, () -> { })
    timeline.Play()
    Require(timeline.Running, "Timeline was not running before owner disposal.")
    host.Dispose()
    Require(!timeline.Running, "Timeline remained running after its owner was disposed.")

    var threw = false
    try {
        timeline.Play()
    } catch (error ObjectDisposedException) {
        threw = true
    }
    Require(threw, "A disposed Timeline owner accepted a restart.")
}

func TimelineOwnerDisposalDuringActionContract() {
    using let host = AnimationSmokeHost()
    let owner = AnimationSmokeCell{}
    let window = Window{Width: 100, Height: 100, Root: owner}
    window.Attach(host)
    host.RenderFrame(0.0)

    var runningDuringDisposal = true
    let timeline = Timeline(owner)
    timeline.Hold(0.0)
    timeline.Run(
        1.0,
        () -> {
            host.Dispose()
            runningDuringDisposal = timeline.Running
        }
    )
    timeline.Play()
    host.RenderFrame(0.0)
    Require(
        !runningDuringDisposal && !timeline.Running,
        "Timeline remained running after its action disposed its owner."
    )
}

func TimelineActionControlContract() {
    using let host = AnimationSmokeHost()
    let owner = AnimationSmokeCell{}
    let window = Window{Width: 100, Height: 100, Root: owner}
    window.Attach(host)
    host.RenderFrame(0.0)

    var stoppedActions = 0
    let stopped = Timeline(owner)
    stopped.Run(
        1.0,
        () -> {
            stoppedActions++
            stopped.Stop()
        }
    )
    stopped.Play()
    Require(stoppedActions == 1 && !stopped.Running, "Stopping in a timeline action did not cancel the run.")

    var replayActions = 0
    let replayed = Timeline(owner)
    replayed.Run(
        1.0,
        () -> {
            replayActions++
            if replayActions == 1 {
                replayed.Play()
            } else {
                replayed.Stop()
            }
        }
    )
    replayed.Play()
    Require(replayActions == 2 && !replayed.Running, "Restarting in a timeline action lost revision control.")

    var failedActions = 0
    let failing = Timeline(owner)
    failing.Run(
        1.0,
        () -> {
            failedActions++
            if failedActions == 2 {
                throw InvalidOperationException("timeline action failure")
            }
        }
    )
    failing.Play()
    var threw = false
    try {
        failing.Play()
    } catch (error InvalidOperationException) {
        threw = true
    }
    Require(threw && failedActions == 2 && !failing.Running, "A failed restart left the timeline running.")

    host.Dispose()
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

    TimelineCompletionContract()
    TimelineReducedLoopContract()
    TimelineNaturalCompletionContract()
    TimelineDisabledLoopContract()
    TimelineOwnerDisposalContract()
    TimelineOwnerDisposalDuringActionContract()
    TimelineActionControlContract()

    Console.WriteLine("PASS: Goo.Animations package motion lifecycle.")
}
