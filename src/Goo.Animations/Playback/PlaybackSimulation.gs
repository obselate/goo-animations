package Goo.Animations

import Goo
import System

internal class PlaybackSimulation : Simulation {
    private let start float64
    private let target float64
    private let cycleDuration float64
    private let totalDuration float64
    private let legs int32
    private let pingPong bool
    private let simulation Simulation

    internal init(
        start float64,
        target float64,
        cycleDuration float64,
        legs int32,
        pingPong bool,
        simulation Simulation
    ) {
        if simulation == nil {
            throw InvalidOperationException("motion specification returned nil")
        }

        this.start = start
        this.target = target
        this.cycleDuration = cycleDuration
        this.legs = legs
        this.pingPong = pingPong
        this.simulation = simulation
        totalDuration = cycleDuration * float64(legs)
    }

    private func legIndex(elapsed float64) int32 {
        let index = int32(Math.Floor(elapsed / cycleDuration))

        return if index >= legs {
            legs - 1
        } else {
            index
        }
    }

    private func legElapsed(elapsed float64, index int32) float64 -> elapsed - float64(index) * cycleDuration

    private func reversing(index int32) bool -> pingPong && index % 2 == 1

    public override func Position(elapsed float64) float64 {
        if elapsed < 0.0 {
            return start
        }
        if Done(elapsed) {
            return target
        }

        let index = legIndex(elapsed)
        let localElapsed = legElapsed(elapsed, index)

        if reversing(index) {
            return simulation.Position(cycleDuration - localElapsed)
        }

        return simulation.Position(localElapsed)
    }

    public override func Velocity(elapsed float64) float64 {
        if elapsed < 0.0 || Done(elapsed) {
            return 0.0
        }

        let index = legIndex(elapsed)
        let localElapsed = legElapsed(elapsed, index)

        if reversing(index) {
            return -simulation.Velocity(cycleDuration - localElapsed)
        }

        return simulation.Velocity(localElapsed)
    }

    public override func Done(elapsed float64) bool -> elapsed >= totalDuration
}
