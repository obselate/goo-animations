package Goo.Animations.Widgets

import Goo

class AnimationGallery : Cell {
    override func Build() Blob -> Container{
        Width: Length.Percent(100),
        Height: Length.Percent(100),
        Padding: 32,
        Gap: 24,
        AlignItems: AlignItems.Center,
        JustifyContent: JustifyContent.Center,
        BackgroundColor: Color.Rgb(20, 24, 33),
        Text{Content: "Motion Primitives", FontSize: 24, Color: Color.White},
        Cell.Mount[TweenDemo](nil),
        Cell.Mount[StaggerDemo](nil),
        Cell.Mount[KeyframeDemo](nil),
        Cell.Mount[PlaybackDemo](nil),
    }
}

func Main() {
    Window.ConfigureApplication("Goo Animation Widgets", "0.1.0", "dev.obselate.gooanimations.widgets")
    Window{Title: "Goo Animations Widgets", Width: 460, Height: 680, Root: AnimationGallery{},}.Run()
}
