package Goo.Animations.Widgets

import Goo
import Goo.Animations
import Goo.Widgets.Actions
import Goo.Widgets.Feedback

class StaggerDemo : Cell {
    private let badgeProgress[]Anim[float64]

    init() {
        badgeProgress = []Anim[float64]{Animate(0.0), Animate(0.0), Animate(0.0), Animate(0.0), Animate(0.0),}
    }

    private func toggleBadges() {
        let target = if badgeProgress[0].Target == 0.0 {
            1.0
        } else {
            0.0
        }
        let spring = Spring.Critical(14.0, 0.001, 0.01)

        for index in 0 ... badgeProgress.Length {
            let delay = float64(index) * 0.12
            badgeProgress[index].To(target, Delay.By(delay, spring))
        }
    }

    override func Build() Blob {
        let badgeRow = Container{FlexDirection: FlexDirection.Row, Gap: 12, AlignItems: AlignItems.Center,}

        for index in 0 ... badgeProgress.Length {
            let value = badgeProgress[index].Value

            badgeRow.Children.Add(
                Badge{
                    Content: (index + 1).ToString(),
                    BackgroundColor: Color.Rgb(74, 125, 255),
                    TransitionMs: 0.0,
                    Transform: PanelTransform{Scale: 0.7 + value * 0.3},
                }.Build()
            )
        }

        return Container{
            Gap: 24,
            AlignItems: AlignItems.Center,
            badgeRow,
            ActionButton{Label: "Stagger badges", OnClick: () -> toggleBadges(),}.Build(),
        }
    }
}
