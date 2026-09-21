package Goo.Animations.Widgets

import Goo
import Goo.Animations
import Goo.Widgets.Actions
import Goo.Widgets.Feedback

class PlaybackDemo : Cell {
    private let repeatPulse Anim[float64]
    private let pingPongOffset Anim[float64]
    private let repeat MotionSpec
    private let pingPong MotionSpec

    init() {
        repeatPulse = Animate(0.0)
        pingPongOffset = Animate(0.0)

        repeat = Playback.Repeat(
            2,
            Keyframes.Offsets(
                0.3,
                []TimedOffset{
                    TimedOffset{Time: 0.0, Offset: 0.0},
                    TimedOffset{Time: 0.5, Offset: 0.18},
                    TimedOffset{Time: 1.0, Offset: 0.0},
                },
                Easing.EaseInOut
            )
        )

        pingPong = Playback.PingPong(1, Cubic.Tween(0.25))
    }

    private func repeatBadge() {
        repeatPulse.To(0.0, repeat)
    }

    private func pingPongBadge() {
        let target = if pingPongOffset.Target <= 0.0 {
            24.0
        } else {
            -24.0
        }

        pingPongOffset.To(target, pingPong)
    }

    override func Build() Blob -> Container{
        Gap: 24,
        AlignItems: AlignItems.Center,
        Container{
            FlexDirection: FlexDirection.Row,
            Gap: 48,
            AlignItems: AlignItems.Center,
            Badge{
                Content: "Repeat x2",
                BackgroundColor: Color.Rgb(168, 85, 247),
                TransitionMs: 0.0,
                Transform: PanelTransform{Scale: 1.0 + repeatPulse.Value},
            }.Build(),
            Badge{
                Content: "Ping-pong",
                BackgroundColor: Color.Rgb(244, 114, 182),
                TransitionMs: 0.0,
                Transform: PanelTransform{TranslateX: pingPongOffset.Value},
            }.Build(),
        },
        Container{
            FlexDirection: FlexDirection.Row,
            Gap: 12,
            ActionButton{Label: "Repeat pulse", OnClick: () -> repeatBadge(),}.Build(),
            ActionButton{Label: "Ping-pong", OnClick: () -> pingPongBadge(),}.Build(),
        },
    }
}
