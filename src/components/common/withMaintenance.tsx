import { ComponentType } from "react";

interface MaintenanceConfig {
  enabled?: boolean;
  title?: string;
  description?: string;
}

const defaultConfig: MaintenanceConfig = {
  enabled: false,
  title: "🚧 개장 준비중...",
  description: "더 나은 서비스로 찾아뵙겠습니다!",
};

/**
 * 점검 모드 HOC
 * @example
 * // 기본 사용
 * export default withMaintenance(MyPage);
 *
 * // 커스텀 메시지
 * export default withMaintenance(MyPage, {
 *   enabled: true,
 *   title: "🔧 점검중",
 *   description: "잠시만 기다려주세요"
 * });
 *
 * // 환경변수로 제어
 * export default withMaintenance(MyPage, {
 *   enabled: import.meta.env.VITE_MAINTENANCE_MODE === "true"
 * });
 */
function withMaintenance<P extends object>(WrappedComponent: ComponentType<P>, config: MaintenanceConfig = {}) {
  const { enabled, title, description } = { ...defaultConfig, ...config };

  function MaintenanceWrapper(props: P) {
    if (enabled) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm">
          <div className="text-center space-y-4 p-8">
            <div className="text-6xl animate-bounce">🐷</div>
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            <p className="text-muted-foreground text-lg">{description}</p>
            <div className="flex justify-center gap-2 mt-6">
              <span className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              <span className="w-3 h-3 bg-primary rounded-full animate-pulse delay-150" />
              <span className="w-3 h-3 bg-primary rounded-full animate-pulse delay-300" />
            </div>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  }

  MaintenanceWrapper.displayName = `withMaintenance(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;

  return MaintenanceWrapper;
}

export { withMaintenance };
export type { MaintenanceConfig };
