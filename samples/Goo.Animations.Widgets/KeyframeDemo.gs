import Goo
import Goo.Animations
import Goo.Widgets.Actions
import Goo.Widgets.Feedback

class KeyframeDemo : Cell {
    private let shakeOffset Anim[float64]
    private let shake MotionSpec

    init() {
        shakeOffset = Animate(0.0)

        shake = Keyframes.Offsets(
            0.45,
            []TimedOffset{
                TimedOffset{Time: 0.0, Offset: 0.0},
                TimedOffset{Time: 0.15, Offset: -12.0},
                TimedOffset{Time: 0.3, Offset: 10.0},
                TimedOffset{Time: 0.45, Offset: -8.0},
                TimedOffset{Time: 0.6, Offset: 6.0},
                TimedOffset{Time: 0.75, Offset: -3.0},
                TimedOffset{Time: 1.0, Offset: 0.0},
            },
            Easing.EaseInOut
        )
    }

    private func shakeBanner() {
        shakeOffset.To(0.0, shake)
    }

    override func Build() Blob -> Container{
        Gap: 24,
        AlignItems: AlignItems.Center,
        Container{
            Width: 360,
            FlexDirection: FlexDirection.Column,
            Banner{
                Content: "Invalid value. Check the highlighted field.",
                Alert: true,
                TransitionMs: 0.0,
                Transform: PanelTransform{TranslateX: shakeOffset.Value},
            }.Build(),
        },
        ActionButton{Label: "Show invalid action", OnClick: () -> shakeBanner(),}.Build(),
    }
}
