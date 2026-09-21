package Goo.Animations

import Goo

internal class KeyframeSimulation : Simulation {
    private let start float64
    private let target float64
    private let duration float64
    private let frames[]Keyframe
    private let simulations[]Simulation

    internal init(start float64, target float64, duration float64, frames[]Keyframe) {
        this.start = start
        this.target = target
        this.duration = duration
        this.frames = frames
        simulations = [frames.Length - 1]Simulation

        for index in 0 ... simulations.Length {
            let first = frames[index]
            let second = frames[index + 1]
            simulations[index] = Motion.Tween(duration * (second.Time - first.Time), first.Easing)(
                framePosition(first),
                framePosition(second),
                0.0
            )
        }
    }

    private func framePosition(frame Keyframe) float64 -> start + (target - start) * frame.Progress + frame.Offset

    private func segmentIndex(time float64) int32 {
        var index = 0

        while index < frames.Length - 2 && time >= frames[index + 1].Time {
            index++
        }

        return index
    }

    public override func Position(elapsed float64) float64 {
        if elapsed < 0.0 {
            return start
        }
        if Done(elapsed) {
            return target
        }

        let time = elapsed / duration
        let index = segmentIndex(time)
        return simulations[index].Position(elapsed - duration * frames[index].Time)
    }

    public override func Velocity(elapsed float64) float64 {
        if elapsed < 0.0 || Done(elapsed) {
            return 0.0
        }

        let time = elapsed / duration
        let index = segmentIndex(time)
        return simulations[index].Velocity(elapsed - duration * frames[index].Time)
    }

    public override func Done(elapsed float64) bool -> elapsed >= duration
}
