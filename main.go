package main

import (
	"context"
	"embed"
	"pomodoro/pkgs/app"
	"pomodoro/pkgs/clock"
	"pomodoro/pkgs/settings"
	"pomodoro/pkgs/tasks"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:frontend/dist
var assets embed.FS

func propagateContext(ctx context.Context, app *app.App, t *tasks.Tasks) {
	app.Ctx = ctx
	t.Ctx = ctx
}
func main() {
	// Create an instance of the app structure
	app := app.NewApp()
	tasks := tasks.NewTasks(app.Ctx)
	settings := settings.NewSettings()
	clock := clock.NewClock(settings)
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
			WindowIsTranslucent: false,
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
