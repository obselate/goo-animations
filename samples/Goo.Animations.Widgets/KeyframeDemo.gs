import Goo
import Goo.Animations
import Goo.Widgets.Actions
import Goo.Widgets.Feedback

class KeyframeDemo : Cell {
    private let shakeOffset Anim[float64]
    private let shakeFactory(float64, float64, float64) -> Simulation

    init() {
        shakeOffset = Animate(0.0)

        let offsetFrame = (time float64, offset float64) -> Keyframe{
            Time: time,
            Progress: time,
            Offset: offset,
            Easing: Easing.EaseInOut,
        }

        shakeFactory = Keyframes.Tween(
            0.45,
            []Keyframe{
                offsetFrame(0.0, 0.0),
                offsetFrame(0.15, -12.0),
                offsetFrame(0.3, 10.0),
                offsetFrame(0.45, -8.0),
                offsetFrame(0.6, 6.0),
                offsetFrame(0.75, -3.0),
                offsetFrame(1.0, 0.0),
            }
        )
    }

    private func shakeBanner() {
        shakeOffset.To(0.0, shakeFactory)
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
