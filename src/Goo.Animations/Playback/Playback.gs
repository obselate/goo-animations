package Goo.Animations

import Goo
import System

/// Creates finite playback decorators for exact-duration simulations.
public class Playback {
    private init() { }

    shared {
        private func validate(cycleDuration float64, factory(float64, float64, float64) -> Simulation) {
            if !Double.IsFinite(cycleDuration) || cycleDuration < 0.0 {
                throw ArgumentOutOfRangeException("cycleDuration")
            }
            if factory == nil {
                throw ArgumentNullException("factory")
            }
        }

        /// Replays a forward simulation a finite number of times.
        /// @param cycleDuration duration of the wrapped simulation in seconds
        /// @param count total number of forward cycles
        /// @param factory exact-duration simulation factory
        /// @returns a reusable scalar simulation factory
        public func Repeat(cycleDuration float64, count int32, factory(float64, float64, float64) -> Simulation)(
            float64,
            float64,
            float64
        ) -> Simulation {
            validate(cycleDuration, factory)

            if count < 1 {
                throw ArgumentOutOfRangeException("count")
            }
            if !Double.IsFinite(cycleDuration * float64(count)) {
                throw ArgumentOutOfRangeException("cycleDuration")
            }
            if count == 1 {
                return factory
            }

            return (start float64, target float64, velocity float64) ->
            PlaybackSimulation(start, target, cycleDuration, count, false, factory(start, target, velocity))
        }

        /// Plays forward once, then backward and forward for each round trip.
        /// @param cycleDuration duration of one direction in seconds
        /// @param roundTrips number of backward-forward pairs after the initial forward leg
        /// @param factory exact-duration simulation factory
        /// @returns a reusable Goo scalar simulation factory
        public func PingPong(cycleDuration float64, roundTrips int32, factory(float64, float64, float64) -> Simulation)(
            float64,
            float64,
            float64
        ) -> Simulation {
            validate(cycleDuration, factory)

            if roundTrips < 0 || roundTrips > (Int32.MaxValue - 1) / 2 {
                throw ArgumentOutOfRangeException("roundTrips")
            }
            if roundTrips == 0 {
                return factory
            }

            let legs = roundTrips * 2 + 1

            if !Double.IsFinite(cycleDuration * float64(legs)) {
                throw ArgumentOutOfRangeException("cycleDuration")
            }

            return (start float64, target float64, velocity float64) ->
            PlaybackSimulation(start, target, cycleDuration, legs, true, factory(start, target, velocity))
        }
    }
}
