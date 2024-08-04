import videojs, { VideoJsPlayer } from "video.js";

const Button = videojs.getComponent("button");
export class VideoJsVrZoomButton extends Button {
  constructor(player: VideoJsPlayer) {
    super(player);
    this.el().innerHTML = "Zoom";
  }
  handleClick() {
    const menu = this.player_.getChild(
      "vrZoomController"
    ) as VideoJsVrZoomController;
    menu.toggleVisible();
  }
}
videojs.registerComponent("vrZoomButton", VideoJsVrZoomButton);
const Component = videojs.getComponent("component");
export class VideoJsVrZoomController extends Component {
  visible = false;
  constructor(
    player: VideoJsPlayer,
    menuOptions: Partial<
      VideoJsVrZoomPluginOptions & {
        defaultZoom: number;
      }
    > = {}
  ) {
    super(player, menuOptions as any);
  }
  createEl() {
    const container = super.createEl(
      "div",
      {
        className: "vjs-zoom-container",
      },
      {}
    );
    const slider = super.createEl(
      "input",
      {
        className: "vjs-zoom-input",
        type: "range",
        min: 0,
        max: 1,
        step: 0.01,
        value: (this.options_ as any).defaultZoom,
      },
      { orient: "vertical" }
    ) as HTMLInputElement;
    slider.addEventListener("input", () => {
      this.trigger("zoom", Number(slider.value));
    });
    container.appendChild(slider);
    this.toggleVisible(false, container as HTMLElement);
    return container;
  }
  toggleVisible(force?: boolean, el?: HTMLElement) {
    if (force == null) {
      force = !this.visible;
    }
    if (el == null) {
      el = this.el() as HTMLElement;
    }
    if (force) {
      el.style.display = "";
      this.visible = true;
    } else {
      el.style.display = "none";
      this.visible = false;
    }
  }
}
videojs.registerComponent("vrZoomController", VideoJsVrZoomController);
const Plugin = videojs.getPlugin("plugin");
export class VideoJsVrZoomPlugin extends Plugin {
  static defaultOptions: VideoJsVrZoomPluginOptions = {
    minFov: 30,
    maxFov: 170,
    defaultFov: 50,
  };
  constructor(
    player: VideoJsPlayer,
    options: Partial<VideoJsVrZoomPluginOptions>
  ) {
    super(player);
    const fullOptions = { ...VideoJsVrZoomPlugin.defaultOptions, options };
    player.ready(() => {
      player.controlBar.addChild("vrZoomButton", options);
      const defaultZoom =
        (fullOptions.defaultFov - fullOptions.minFov) /
        (fullOptions.maxFov - fullOptions.minFov);
      const menu = player.addChild("vrZoomController", {
        ...fullOptions,
        defaultZoom,
      });
      menu.on("zoom", (e, zoom) => {
        const vr = (player as any).vr();
        const fov =
          fullOptions.minFov +
          (fullOptions.maxFov - fullOptions.minFov) * (1 - zoom);
        vr.camera.fov = fov;
        vr.camera.updateProjectionMatrix();
      });
    });
  }
}
videojs.registerPlugin("vrZoom", VideoJsVrZoomPlugin);
declare module "video.js" {
  export interface VideoJsPlayer {
    vrZoom: (
      options?: Partial<VideoJsVrZoomPluginOptions>
    ) => VideoJsVrZoomPlugin;
  }
  export interface VideoJsPlayerPluginOptions {
    vrZoom?: Partial<VideoJsVrZoomPluginOptions>;
  }
}
export interface VideoJsVrZoomPluginOptions {
  minFov: number;
  maxFov: number;
  defaultFov: number;
}