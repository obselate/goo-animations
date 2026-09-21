package Goo.Animations.QuickStart

import Goo
import Goo.Animations

class TweenPreview : Cell {
    private let offset Anim[float64]

    init() {
        offset = Animate(0.0)
    }

    private func toggle() {
        let target = if offset.Target == 0.0 {
            220.0
        } else {
            0.0
        }

        offset.To(target, Spring.Damped(10.0, 0.5, 0.1, 1.0))
    }

    override func Build() Blob -> Container{
        Width: Length.Percent(100),
        Height: Length.Percent(100),
        Padding: 24,
        Gap: 16,
        AlignItems: AlignItems.Center,
        JustifyContent: JustifyContent.Center,
        BackgroundColor: Color.Rgb(20, 24, 33),
        Text{Content: "Goo Motion", FontSize: 24, Color: Color.White,},
        Container{
            Width: 300,
            Height: 72,
            Padding: 12,
            BorderRadius: 12,
            BackgroundColor: Color.Rgb(36, 43, 48),
            Overflow: Overflow.Hidden,
            Container{
                Width: 48,
                Height: 48,
                BorderRadius: 24,
                BackgroundColor: Color.Rgb(74, 125, 255),
                Transform: PanelTransform{TranslateX: offset.Value},
            },
        },
        Button{
            Padding: 12,
            BorderRadius: 8,
            BackgroundColor: Color.Rgb(74, 125, 255),
            OnClick: () -> toggle(),
            Text{Content: "Move", Color: Color.White},
        },
        Cell.Mount[EntryPreview](),
    }
}

class EntryPreview : Cell {
    private let progress Anim[float64]

    init() {
        progress = Animate(0.0)
    }

    private func toggle() {
        let target = if progress.Target == 0.0 {
            1.0
        } else {
            0.0
        }

        progress.To(target, Cubic.Tween(0.22))
    }

    override func Build() Blob -> Container{
        Gap: 12,
        AlignItems: AlignItems.Center,
        Container{
            Width: 300,
            Height: 72,
            Padding: 16,
            BorderRadius: 12,
            BackgroundColor: Color.Rgb(44, 52, 68),
            Opacity: progress.Value,
            Transform: PanelTransform{TranslateY: (1.0 - progress.Value) * 16.0},
            Text{Content: "Entry Presentation", Color: Color.White,},
        },
        Button{
            Padding: 12,
            BorderRadius: 8,
            BackgroundColor: Color.Rgb(74, 125, 255),
            OnClick: () -> toggle(),
            Text{Content: "Toggle entry", Color: Color.White},
        },
    }
}

func Main() {
    Window.ConfigureApplication("Goo Animations", "0.1.0", "dev.obselate.gooanimations")
    Window{Title: "Goo Animations", Width: 420, Height: 460, Root: TweenPreview{},}.Run()
}
