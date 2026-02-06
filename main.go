package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := NewApp()
	tasks := NewTasks()
	settings := NewSettings()
	clock := NewClock(settings)
	// Create application with options
	err := wails.Run(&options.App{
		Title:  "pomodoro",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 0, G: 0, B: 0, A: 0},
		OnStartup:        app.startup,
		Windows: &windows.Options{
			WindowIsTranslucent: true,
			BackdropType:        windows.Acrylic,
		},
		Linux: &linux.Options{
			WindowIsTranslucent: true,
		},
		Bind: []any{
			app,
			clock,
			tasks,
			settings,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
