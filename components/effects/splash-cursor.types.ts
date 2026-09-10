export type SplashCursorColor = {
  r: number;
  g: number;
  b: number;
};

export type SplashCursorProps = {
  SIM_RESOLUTION?: number;
  DYE_RESOLUTION?: number;
  CAPTURE_RESOLUTION?: number;
  DENSITY_DISSIPATION?: number;
  VELOCITY_DISSIPATION?: number;
  PRESSURE?: number;
  PRESSURE_ITERATIONS?: number;
  CURL?: number;
  SPLAT_RADIUS?: number;
  SPLAT_FORCE?: number;
  SHADING?: boolean;
  COLOR_UPDATE_SPEED?: number;
  BACK_COLOR?: SplashCursorColor;
  TRANSPARENT?: boolean;
  RAINBOW_MODE?: boolean;
  COLOR?: string;
  /** Regions where SplashCursor is hidden / inactive (Hero uses `[data-hero]`). */
  excludeSelector?: string;
};
