package Goo.Animations.Widgets

import Goo
import Goo.Animations
import Goo.Widgets.Actions
import Goo.Widgets.Feedback

class TweenDemo : Cell {
    private let motionProgress Anim[float64]
    private let cubicProgress Anim[float64]

    init() {
        motionProgress = Animate(0.0)
        cubicProgress = Animate(0.0)
    }

    private func toggle() {
        let target = if motionProgress.Target == 0.0 {
            1.0
        } else {
            0.0
        }

        motionProgress.To(target, Motion.Tween(0.6, Easing.EaseInOut))
        cubicProgress.To(target, Cubic.Tween(0.6))
    }

    override func Build() Blob -> Container{
        Gap: 24,
        AlignItems: AlignItems.Center,
        Text{Content: "Motion Tween", FontSize: 14, Color: Color.Rgb(161, 161, 170),},
        ProgressBar{
            Value: motionProgress.Value,
            Width: 360,
            Height: 12,
            FillColor: Color.Rgb(74, 125, 255),
            TransitionMs: 0.0,
            AccessibilityName: "Motion Tween Progress",
        }.Build(),
        Text{Content: "Cubic Tween", FontSize: 14, Color: Color.Rgb(161, 161, 170),},
        ProgressBar{
            Value: cubicProgress.Value,
            Width: 320,
            Height: 12,
            FillColor: Color.Rgb(52, 211, 153),
            TransitionMs: 0.0,
            AccessibilityName: "Cubic Progress",
        }.Build(),
        ActionButton{Label: "Toggle progress", OnClick: () -> toggle(),}.Build(),
    }
}
