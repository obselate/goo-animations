package Goo.Animations

import Goo
import System

/// Creates finite playback decorators for exact-duration simulations.
public class Playback {
    private init() { }

    shared {
        private func play(spec MotionSpec, legs int32, alternate bool) MotionSpec {
            let duration = spec.Duration * float64(legs)
            if !Double.IsFinite(duration) {
                throw ArgumentOutOfRangeException("spec")
            }

            return MotionSpec(
                duration,
                (start float64, target float64, velocity float64) -> PlaybackSimulation(
                    start,
                    target,
                    spec.Duration,
                    legs,
                    alternate,
                    spec.Factory(start, target, velocity)
                )
            )
        }

        /// Replays a forward simulation a finite number of times.
        /// @param count total number of forward cycles
        /// @param spec exact-duration motion specification
        /// @returns a reusable motion specification with the combined duration
        public func Repeat(count int32, spec MotionSpec) MotionSpec {
            if spec == nil {
                throw ArgumentNullException("spec")
            }
            if count < 1 {
                throw ArgumentOutOfRangeException("count")
            }
            if count == 1 {
                return spec
            }

            return play(spec, count, false)
        }

        /// Plays forward once, then backward and forward for each round trip.
        /// @param roundTrips number of backward-forward pairs after the initial forward leg
        /// @param spec exact-duration motion specification
        /// @returns a reusable motion specification with the combined duration
        public func PingPong(roundTrips int32, spec MotionSpec) MotionSpec {
            if spec == nil {
                throw ArgumentNullException("spec")
            }
            if roundTrips < 0 || roundTrips > (Int32.MaxValue - 1) / 2 {
                throw ArgumentOutOfRangeException("roundTrips")
            }
            if roundTrips == 0 {
                return spec
            }

            let legs = roundTrips * 2 + 1
            return play(spec, legs, true)
        }
    }
}
