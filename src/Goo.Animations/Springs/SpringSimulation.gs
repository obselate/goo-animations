package Goo.Animations

import Goo
import System

internal class SpringSimulation : Simulation {
    private let target float64
    private let omega float64
    private let dampingRatio float64
    private let displacement float64
    private let initialVelocity float64
    private let positionTolerance float64
    private let velocityTolerance float64

    internal init(
        start float64,
        target float64,
        velocity float64,
        omega float64,
        dampingRatio float64,
        positionTolerance float64,
        velocityTolerance float64
    ) {
        this.target = target
        this.omega = omega
        this.dampingRatio = dampingRatio
        this.positionTolerance = positionTolerance
        this.velocityTolerance = velocityTolerance
        displacement = start - target
        initialVelocity = velocity
    }

    private func criticalCoefficient() float64 -> initialVelocity + omega * displacement

    private func isUnderdamped() bool -> dampingRatio < 0.9999

    private func isOverdamped() bool -> dampingRatio > 1.0001

    private func underdampedTerms()(decayRate float64, frequency float64, sineCoefficient float64) {
        let decayRate = dampingRatio * omega
        let frequency = omega * Math.Sqrt(1.0 - dampingRatio * dampingRatio)
        return (decayRate, frequency, (initialVelocity + decayRate * displacement) / frequency)
    }

    private func overdampedTerms()(
        slowRate float64,
        fastRate float64,
        slowCoefficient float64,
        fastCoefficient float64
    ) {
        let root = Math.Sqrt(dampingRatio * dampingRatio - 1.0)
        let slowRate = -omega * (dampingRatio - root)
        let fastRate = -omega * (dampingRatio + root)
        let slowCoefficient = (initialVelocity - fastRate * displacement) / (slowRate - fastRate)
        return (slowRate, fastRate, slowCoefficient, displacement - slowCoefficient)
    }

    private func criticalDisplacement(elapsed float64) float64 {
        let coefficient = criticalCoefficient()
        return (displacement + coefficient * elapsed) * Math.Exp(-omega * elapsed)
    }

    private func criticalVelocity(elapsed float64) float64 {
        let coefficient = criticalCoefficient()
        let linear = displacement + coefficient * elapsed
        return (coefficient - omega * linear) * Math.Exp(-omega * elapsed)
    }

    private func underdampedDisplacement(elapsed float64) float64 {
        let terms = underdampedTerms()
        let phase = terms.frequency * elapsed
        let oscillation =
        displacement * Math.Cos(phase) + terms.sineCoefficient * Math.Sin(phase)

        return Math.Exp(-terms.decayRate * elapsed) * oscillation
    }

    private func underdampedVelocity(elapsed float64) float64 {
        let terms = underdampedTerms()
        let phase = terms.frequency * elapsed
        let oscillation =
        displacement * Math.Cos(phase) + terms.sineCoefficient * Math.Sin(phase)
        let oscillationVelocity =
        -displacement * terms.frequency * Math.Sin(phase) + terms.sineCoefficient * terms.frequency * Math.Cos(phase)

        return Math.Exp(-terms.decayRate * elapsed) *
        (oscillationVelocity - terms.decayRate * oscillation)
    }

    private func overdampedDisplacement(elapsed float64) float64 {
        let terms = overdampedTerms()

        return terms.slowCoefficient * Math.Exp(terms.slowRate * elapsed) + terms.fastCoefficient * Math.Exp(
            terms.fastRate * elapsed
        )
    }

    private func overdampedVelocity(elapsed float64) float64 {
        let terms = overdampedTerms()

        return terms.slowRate * terms.slowCoefficient * Math.Exp(terms.slowRate * elapsed) +
            terms.fastRate * terms.fastCoefficient * Math.Exp(terms.fastRate * elapsed)
    }

    private func decayedMagnitude(magnitude float64, exponent float64) float64 {
        if magnitude == 0.0 {
            return 0.0
        }
        return Math.Exp(Math.Log(magnitude) + exponent)
    }

    private func decayedTimeMagnitude(magnitude float64, decayRate float64, elapsed float64) float64 {
        if magnitude == 0.0 {
            return 0.0
        }
        return Math.Exp(
            Math.Log(magnitude) + Math.Log(elapsed) -
            decayRate * elapsed
        )
    }

    private func decayedProductMagnitude(first float64, second float64, exponent float64) float64 {
        if first == 0.0 || second == 0.0 {
            return 0.0
        }
        return Math.Exp(Math.Log(first) + Math.Log(second) + exponent)
    }

    private func futureEnvelope(constant float64, slope float64, elapsed float64) float64 {
        let slopePeakTime = Math.Max(elapsed, 1.0 / omega)
        return decayedMagnitude(constant, -omega * elapsed) + decayedTimeMagnitude(slope, omega, slopePeakTime)
    }

    private func criticalDone(elapsed float64) bool {
        let coefficient = criticalCoefficient()
        let positionBound =
        futureEnvelope(Math.Abs(displacement), Math.Abs(coefficient), elapsed)
        let velocityBound =
        futureEnvelope(Math.Abs(initialVelocity), omega * Math.Abs(coefficient), elapsed)

        return positionBound <= positionTolerance && velocityBound <= velocityTolerance
    }

    private func underdampedDone(elapsed float64) bool {
        let terms = underdampedTerms()
        let velocitySineCoefficient =
        -terms.frequency * displacement - terms.decayRate * terms.sineCoefficient

        let positionAmplitude =
        Double.Hypot(displacement, terms.sineCoefficient)
        let velocityAmplitude =
        Double.Hypot(initialVelocity, velocitySineCoefficient)
        let exponent = -terms.decayRate * elapsed

        return decayedMagnitude(positionAmplitude, exponent) <= positionTolerance &&
            decayedMagnitude(velocityAmplitude, exponent) <= velocityTolerance
    }

    private func overdampedDone(elapsed float64) bool {
        let terms = overdampedTerms()

        let positionBound =
        decayedMagnitude(Math.Abs(terms.slowCoefficient), terms.slowRate * elapsed) +
            decayedMagnitude(Math.Abs(terms.fastCoefficient), terms.fastRate * elapsed)
        let velocityBound =
        decayedProductMagnitude(Math.Abs(terms.slowRate), Math.Abs(terms.slowCoefficient), terms.slowRate * elapsed) +
            decayedProductMagnitude(Math.Abs(terms.fastRate), Math.Abs(terms.fastCoefficient), terms.fastRate * elapsed)

        return positionBound <= positionTolerance && velocityBound <= velocityTolerance
    }

    public override func Position(elapsed float64) float64 {
        if Done(elapsed) {
            return target
        }

        let remaining = if isUnderdamped() {
            underdampedDisplacement(elapsed)
        } else if isOverdamped() {
            overdampedDisplacement(elapsed)
        } else {
            criticalDisplacement(elapsed)
        }
        return target + remaining
    }

    public override func Velocity(elapsed float64) float64 {
        if Done(elapsed) {
            return 0.0
        }

        if isUnderdamped() {
            return underdampedVelocity(elapsed)
        }
        if isOverdamped() {
            return overdampedVelocity(elapsed)
        }
        return criticalVelocity(elapsed)
    }

    public override func Done(elapsed float64) bool {
        if Double.IsNaN(elapsed) || elapsed < 0.0 {
            return false
        }
        if Double.IsPositiveInfinity(elapsed) {
            return true
        }

        if isUnderdamped() {
            return underdampedDone(elapsed)
        }
        if isOverdamped() {
            return overdampedDone(elapsed)
        }

        return criticalDone(elapsed)
    }
}
