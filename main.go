package main

import (
	"context"
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

func propagateContext(ctx context.Context, app *App, t *Tasks) {
	app.ctx = ctx
	t.ctx = ctx
}
func main() {
	// Create an instance of the app structure
	app := NewApp()
	tasks := NewTasks(app.ctx)
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
		OnStartup: func(ctx context.Context) {
			propagateContext(ctx, app, tasks)
		},
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
