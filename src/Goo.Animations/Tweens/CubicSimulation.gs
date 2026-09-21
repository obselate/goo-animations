package Goo.Animations

import Goo

internal class CubicSimulation : Simulation {
    private let start float64
    private let target float64
    private let initialVelocity float64
    private let duration float64

    internal init(start float64, target float64, initialVelocity float64, duration float64) {
        this.start = start
        this.target = target
        this.initialVelocity = initialVelocity
        this.duration = duration
    }

    public override func Position(elapsed float64) float64 {
        if elapsed < 0.0 {
            return start
        }
        if Done(elapsed) {
            return target
        }

        let u = elapsed / duration
        let uSquared = u * u
        let uCubed = uSquared * u
        let distance = target - start
        let progress = 3.0 * uSquared - 2.0 * uCubed
        let velocityShape = uCubed - 2.0 * uSquared + u

        return start + distance * progress + initialVelocity * duration * velocityShape
    }

    public override func Velocity(elapsed float64) float64 {
        if elapsed < 0.0 || Done(elapsed) {
            return 0.0
        }

        let u = elapsed / duration
        let uSquared = u * u
        let distance = target - start
        let progressSlope = 6.0 * u - 6.0 * uSquared
        let velocityShapeSlope = 3.0 * uSquared - 4.0 * u + 1.0

        return distance * progressSlope / duration + initialVelocity * velocityShapeSlope
    }

    public override func Done(elapsed float64) bool -> elapsed >= duration
}
