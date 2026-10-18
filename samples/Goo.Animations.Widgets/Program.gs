package Goo.Animations.Widgets

import Goo
import Goo.Widgets

class AnimationGallery : Cell {
    override func Build() Blob {
        let theme = Theme.Read()
        return Container{
            BasedOn: theme.CanvasStyle,
            Width: Percent(100),
            Height: Percent(100),
            Padding: 32,
            Gap: 24,
            AlignItems: AlignItems.Center,
            JustifyContent: JustifyContent.Center,
            BackgroundColor: theme.CanvasColor,
            Text{Content: "Motion Primitives", FontSize: 24},
            Cell.Mount[TweenDemo](nil),
            Cell.Mount[StaggerDemo](nil),
            Cell.Mount[KeyframeDemo](nil),
            Cell.Mount[PlaybackDemo](nil),
        }
    }
}

func Main() {
    Window.ConfigureApplication("Goo Animation Widgets", "0.1.0", "dev.obselate.gooanimations.widgets")
    let window = Window{Title: "Goo Animations Widgets", Width: 460, Height: 680, Root: AnimationGallery{}}
    Theme.Attach(window)
    window.Run()
}
