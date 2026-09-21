package Goo.Animations.Widgets

import Goo
import Goo.Animations
import Goo.Widgets.Actions
import Goo.Widgets.Feedback

class PlaybackDemo : Cell {
    private let repeatPulse Anim[float64]
    private let pingPongOffset Anim[float64]
    private let repeatFactory(float64, float64, float64) -> Simulation
    private let pingPongFactory(float64, float64, float64) -> Simulation

    init() {
        repeatPulse = Animate(0.0)
        pingPongOffset = Animate(0.0)

        let offsetFrame = (time float64, offset float64) -> Keyframe{
            Time: time,
            Progress: time,
            Offset: offset,
            Easing: Easing.EaseInOut,
        }

        repeatFactory = Playback.Repeat(
            0.3,
            2,
            Keyframes.Tween(0.3, []Keyframe{offsetFrame(0.0, 0.0), offsetFrame(0.5, 0.18), offsetFrame(1.0, 0.0),})
        )

        pingPongFactory = Playback.PingPong(0.25, 1, Cubic.Tween(0.25))
    }

    private func repeatBadge() {
        repeatPulse.To(0.0, repeatFactory)
    }

    private func pingPongBadge() {
        let target = if pingPongOffset.Target <= 0.0 {
            24.0
        } else {
            -24.0
        }

        pingPongOffset.To(target, pingPongFactory)
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
