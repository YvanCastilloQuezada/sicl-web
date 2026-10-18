# Auditoría Total de LUKA OS / MiLukita — Fase 0

**Fecha de corte:** 2026-09-01T08:08:58.950Z  
**Proyecto:** ruleta-peru-online  
**Versión auditada:** Fase 1 MVP de lanzamiento  
**Autor:** Manus AI  
**Alcance:** inventario técnico, arquitectura, Capability Registry, organigrama, visión, estado, deuda, recomendaciones y límites de MJP CORE.

> **Dictamen ejecutivo.** LUKA dispone de una base funcional verificable en sandbox: entrada contextual, Intent Engine determinista, detector simulado, runtime Smart TV simulado, Visor AR y laboratorio LUKA at Home. La Fase 1 deja disponibles Visor AR territorial y LUKA TV; las capacidades restantes quedan ocultas. Esto no equivale a operación productiva: SDKs, red, hardware, proveedores y QA físico permanecen pendientes.

## 1. Semáforo de alcance

| Área | Estado verificable | Evidencia | Limitación crítica |
|---|---|---|---|
| MJP CORE | PROTECTED / SIN CAMBIOS | Contratos y pruebas de aislamiento | Revisión externa del diff final |
| LUKA Entry | IMPLEMENTED-SANDBOX | Entrada contextual y fallback | Wake word real no certificado |
| Intent Engine | IMPLEMENTED-SANDBOX | Matriz de 10 comandos y confirmación | Sin ASR/NLU productivo |
| Device Detector | IMPLEMENTED-SANDBOX | Fuentes Wi-Fi/Bluetooth simuladas | El navegador no escanea redes automáticamente |
| LUKA TV Runtime | IMPLEMENTED-SANDBOX | Perfiles, LRUD, QR y pantalla virtual | Cast, TWA, DLNA/UPnP y SDKs no integrados |
| Visor AR | IMPLEMENTED-SANDBOX / PREPARADO | WebXR, cámara, GPS contextual y placeholder | QA físico y modelo 3D definitivo pendientes |
| LUKA at Home | IMPLEMENTED-SANDBOX | Luces navegables e indicadores | Sin hubs, Matter, Wi-Fi o Bluetooth |
| Capability Registry | IMPLEMENTED | Estados available/hidden aplicados | Aprobación de producto pendiente |

## 2. Inventario completo del código

### 2.1 Conteo por área

| Área | Archivos | Función dominante |
|---|---:|---|
| client | 179 | UI React, entrada LUKA, Controller Lab y AR |
| server | 119 | Express, tRPC, auth y simuladores |
| shared | 160 | Contratos, invariantes, agentes y pruebas |
| drizzle | 84 | Esquema y migraciones |
| docs | 202 | Auditorías y especificaciones |
| scripts | 23 | Scripts de simulación y reportes |

### 2.2 Inventario literal de archivos

- client/index.html
- client/public/.gitkeep
- client/public/__manus__/debug-collector.js
- client/public/__manus__/version.json
- client/public/manifest.webmanifest
- client/public/offline.html
- client/public/pwa-icon.svg
- client/public/sw.js
- client/src/App.tsx
- client/src/_core/hooks/useAuth.ts
- client/src/components/AIChatBox.tsx
- client/src/components/AgentAutonomyPlanPanel.tsx
- client/src/components/AgentPermissionsPanel.tsx
- client/src/components/AgentRegistryPanel.tsx
- client/src/components/AuditReportsPanel.tsx
- client/src/components/AutonomyControlPanel.tsx
- client/src/components/AutonomyMonitoringPanel.tsx
- client/src/components/BossFightTestPanel.tsx
- client/src/components/Brand/BrandColors.ts
- client/src/components/Brand/Logo.tsx
- client/src/components/Brand/LukitaAvatar.tsx
- client/src/components/BrandPreviewPanel.tsx
- client/src/components/BroadcastAccessGuide.tsx
- client/src/components/BroadcastOperationsPanel.tsx
- client/src/components/BroadcastTestLab.tsx
- client/src/components/CharacterDecisionMonitor.tsx
- client/src/components/CharacterEventLogPanel.tsx
- client/src/components/CharacterExperiencePanel.tsx
- client/src/components/ConsolidationStatusPanel.tsx
- client/src/components/ConstitutionalContractReviewPanel.tsx
- client/src/components/ConstitutionalOrgChartPanel.tsx
- client/src/components/DashboardLayout.tsx
- client/src/components/DashboardLayoutSkeleton.tsx
- client/src/components/DistributionOsPanel.tsx
- client/src/components/EntertainmentOsHelpPanel.tsx
- client/src/components/ErrorBoundary.tsx
- client/src/components/ExperienceAgentProposalsPanel.tsx
- client/src/components/FailSafeAlertsPanel.tsx
- client/src/components/FinancialTaxIntelligencePanel.tsx
- client/src/components/HumanAuthorityDocumentsPanel.tsx
- client/src/components/IdentityParticipationPanel.tsx
- client/src/components/IntelligenceAgentsPanel.tsx
- client/src/components/LiveChannelPanel.tsx
- client/src/components/LrciReviewCasesPanel.tsx
- client/src/components/LukaRuntimeLab.tsx
- client/src/components/LukaUniversalEntry.tsx
- client/src/components/LukitaBlockoutViewer.tsx
- client/src/components/LukitaGeoPlacementPanel.tsx
- client/src/components/LukitaScriptsPanel.tsx
- client/src/components/ManifestConnectionStatus.tsx
- client/src/components/ManifestStatsPanel.tsx
- client/src/components/ManifestTestPanel.tsx
- client/src/components/ManusDialog.tsx
- client/src/components/Map.tsx
- client/src/components/MarketingIntelligencePanel.tsx
- client/src/components/MasterFlowMonitor.tsx
- client/src/components/MasterOrderStatusPanel.tsx
- client/src/components/MiLukitaCircularQR.tsx
- client/src/components/OnlineTvConfigProfiles.tsx
- client/src/components/PilotLayout.tsx
- client/src/components/ProductAnalyticsBeacon.tsx
- client/src/components/ProgramSchedulePanel.tsx
- client/src/components/PwaInstallButton.tsx
- client/src/components/PwaInstallNudge.tsx
- client/src/components/RealtimePlayerLobby.tsx
- client/src/components/SmartTvConnectionSimulator.tsx
- client/src/components/StagingFinancePanel.tsx
- client/src/components/TVBrandGuide.tsx
- client/src/components/TimerPaletteAdminPanel.tsx
- client/src/components/TouchGuide.tsx
- client/src/components/TvAgentsStatus.tsx
- client/src/components/TvHeartbeatStatus.tsx
- client/src/components/TvMaintenanceScreen.tsx
- client/src/components/TvModeStartScreen.tsx
- client/src/components/TvRemoteNeon.tsx
- client/src/components/TvScreensaver.tsx
- client/src/components/ui/accordion.tsx
- client/src/components/ui/alert-dialog.tsx
- client/src/components/ui/alert.tsx
- client/src/components/ui/aspect-ratio.tsx
- client/src/components/ui/avatar.tsx
- client/src/components/ui/badge.tsx
- client/src/components/ui/breadcrumb.tsx
- client/src/components/ui/button-group.tsx
- client/src/components/ui/button.tsx
- client/src/components/ui/calendar.tsx
- client/src/components/ui/card.tsx
- client/src/components/ui/carousel.tsx
- client/src/components/ui/chart.tsx
- client/src/components/ui/checkbox.tsx
- client/src/components/ui/collapsible.tsx
- client/src/components/ui/command.tsx
- client/src/components/ui/context-menu.tsx
- client/src/components/ui/dialog.tsx
- client/src/components/ui/drawer.tsx
- client/src/components/ui/dropdown-menu.tsx
- client/src/components/ui/empty.tsx
- client/src/components/ui/field.tsx
- client/src/components/ui/form.tsx
- client/src/components/ui/hover-card.tsx
- client/src/components/ui/input-group.tsx
- client/src/components/ui/input-otp.tsx
- client/src/components/ui/input.tsx
- client/src/components/ui/item.tsx
- client/src/components/ui/kbd.tsx
- client/src/components/ui/label.tsx
- client/src/components/ui/menubar.tsx
- client/src/components/ui/navigation-menu.tsx
- client/src/components/ui/pagination.tsx
- client/src/components/ui/popover.tsx
- client/src/components/ui/progress.tsx
- client/src/components/ui/radio-group.tsx
- client/src/components/ui/resizable.tsx
- client/src/components/ui/scroll-area.tsx
- client/src/components/ui/select.tsx
- client/src/components/ui/separator.tsx
- client/src/components/ui/sheet.tsx
- client/src/components/ui/sidebar.tsx
- client/src/components/ui/skeleton.tsx
- client/src/components/ui/slider.tsx
- client/src/components/ui/sonner.tsx
- client/src/components/ui/spinner.tsx
- client/src/components/ui/switch.tsx
- client/src/components/ui/table.tsx
- client/src/components/ui/tabs.tsx
- client/src/components/ui/textarea.tsx
- client/src/components/ui/toggle-group.tsx
- client/src/components/ui/toggle.tsx
- client/src/components/ui/tooltip.tsx
- client/src/const.ts
- client/src/contexts/LanguageContext.test.ts
- client/src/contexts/LanguageContext.tsx
- client/src/contexts/ThemeContext.tsx
- client/src/data/games.ts
- client/src/hooks/useComposition.ts
- client/src/hooks/useCountdown.ts
- client/src/hooks/useMobile.tsx
- client/src/hooks/usePersistFn.ts
- client/src/hooks/useRealtimePlayer.ts
- client/src/hooks/useTvRemoteNavigation.ts
- client/src/index.css
- client/src/lib/accessibility.test.ts
- client/src/lib/accessibility.ts
- client/src/lib/constitutionalOrgChartExport.test.ts
- client/src/lib/constitutionalOrgChartExport.ts
- client/src/lib/customQrGenerator.test.ts
- client/src/lib/customQrGenerator.ts
- client/src/lib/practiceSimulator.test.ts
- client/src/lib/practiceSimulator.ts
- client/src/lib/trpc.ts
- client/src/lib/utils.ts
- client/src/main.tsx
- client/src/pages/AuditSummaryPage.tsx
- client/src/pages/BatchHistoryPage.tsx
- client/src/pages/BroadcastPage.tsx
- client/src/pages/CircularQrPreviewPage.tsx
- client/src/pages/CommercialPage.tsx
- client/src/pages/ComponentShowcase.tsx
- client/src/pages/ConstitutionalOrgChartPage.tsx
- client/src/pages/ControlRoom.tsx
- client/src/pages/GamePage.tsx
- client/src/pages/Home.tsx
- client/src/pages/ImpactoPage.tsx
- client/src/pages/LearnPage.tsx
- client/src/pages/Lukita3DStudioPage.tsx
- client/src/pages/LukitaARStagePage.tsx
- client/src/pages/MultiMarketPage.tsx
- client/src/pages/NotFound.tsx
- client/src/pages/OnlineTvGamesPage.tsx
- client/src/pages/Operations.tsx
- client/src/pages/Profile.tsx
- client/src/pages/QrGeneratorPage.tsx
- client/src/pages/RtpDashboardPage.tsx
- client/src/pages/SimplifiedGamesPage.tsx
- client/src/pages/SystemStatusPage.tsx
- client/src/pages/TouchRemotePage.tsx
- client/src/pages/TransparenciaPage.tsx
- client/src/pages/Verify.tsx
- client/src/pages/Wallet.tsx
- docs/AGENT_AUTHORITY_MATRIX.md
- docs/AR_STAGE_PAD_ASSET_FINDINGS_2026-08-28.md
- docs/AR_STAGE_PAD_QA_MOBILE_2026-08-28.md
- docs/AUTONOMY.md
- docs/AVATAR.md
- docs/BUSINESS_COMMAND_CENTER.md
- docs/BUSINESS_STRATEGY_AGENT.md
- docs/CHARACTER_COMMERCIAL_FINAL_VALIDATION.log
- docs/CHARACTER_COMMERCIAL_VALIDATION.log
- docs/CHARACTER_OBSERVABILITY_FINAL_VALIDATION.log
- docs/COMMERCIAL_OS_VALIDATION.log
- docs/CONTENT_ENGINE.md
- docs/CONTINGENCY.md
- docs/CONTROL_ROOM.md
- docs/CONTROL_ROOM_OS_VALIDATION.log
- docs/CONTROL_ROOM_USABILITY_VALIDATION.log
- docs/DEVICE_COMPATIBILITY_MATRIX.md
- docs/DISTRIBUTION_OS_FINAL_VALIDATION.log
- docs/EXPERIENCE_DIRECTOR_AGENT.md
- docs/EXPERIENCE_ENGINE.md
- docs/FINANCIAL_INTELLIGENCE_AGENT.md
- docs/GAME_MATHEMATICS.md
- docs/LEGAL_COMPLIANCE_INTELLIGENCE_AGENT.md
- docs/LUKA_OS_PHASES_3_8_SANDBOX_AUDIT.md
- docs/LUKA_OS_SPEC_V1_IMPLEMENTATION.md
- docs/LUKITA_3D_PRODUCTION_SPEC.md
- docs/LUKITA_AR_STAGE_PROPOSAL.md
- docs/LUKITA_AVATAR_CONCEPT.md
- docs/LUKITA_CHARACTER_SYSTEM.md
- docs/LUKITA_LIVE_ARCHITECTURE.md
- docs/LUKITA_MASTER_CHARACTER_GUIDE.md
- docs/MILUKITA_15_MINUTE_EXPERIENCE.md
- docs/MILUKITA_AGENT_AUTONOMOUS_ADVANCEMENT_PLAN.md
- docs/MILUKITA_AGENT_OBSERVABILITY.md
- docs/MILUKITA_AGENT_STATUS_REPORT.md
- docs/MILUKITA_AUDITORIA_COMPLETA_UNICA.md
- docs/MILUKITA_AUDITORIA_GEO_AR_VOL_VIGENTE_2026-08-28.md
- docs/MILUKITA_AUDITORIA_TOTAL_EXTERNA.md
- docs/MILUKITA_AUDITORIA_TOTAL_EXTERNA_VALIDATION.log
- docs/MILUKITA_AUDITORIA_TOTAL_UNIFICADA.md
- docs/MILUKITA_AUDIT_UI_VALIDATION.log
- docs/MILUKITA_AUTONOMY_AUDIT.md
- docs/MILUKITA_AUTONOMY_READINESS_REPORT.md
- docs/MILUKITA_CASTING_POLICY.md
- docs/MILUKITA_CHARACTER_BIBLE.md
- docs/MILUKITA_CHARACTER_EXPERIENCE_SYSTEM.md
- docs/MILUKITA_CHARACTER_LIFECYCLE.md
- docs/MILUKITA_CHARACTER_PERFORMANCE.md
- docs/MILUKITA_CHARACTER_STATE_MACHINE.md
- docs/MILUKITA_COMMERCIAL_AUDIT.md
- docs/MILUKITA_COMMERCIAL_OS.md
- docs/MILUKITA_CONTROLLER_LAB_MANUAL.md
- docs/MILUKITA_CONTROLLER_PRODUCT_CONCEPT.md
- docs/MILUKITA_DISTRIBUTION_OS.md
- docs/MILUKITA_ENTERTAINMENT_OS.md
- docs/MILUKITA_ENTERTAINMENT_OS_AUDIT.md
- docs/MILUKITA_ENTERTAINMENT_OS_EXECUTION_REPORT.md
- docs/MILUKITA_ENTERTAINMENT_OS_VALIDATION.log
- docs/MILUKITA_EXPERIENCE_ORCHESTRATOR.md
- docs/MILUKITA_FAST_READINESS.md
- docs/MILUKITA_GOVERNANCE_OS_LEGAL_FRAMEWORK.md
- docs/MILUKITA_IDENTITY_ARCHITECTURE.md
- docs/MILUKITA_IDENTITY_PARTICIPATION_IMPLEMENTATION.md
- docs/MILUKITA_KILL_CHARACTER_TEST.md
- docs/MILUKITA_KILL_LUKITA_RUNTIME.md
- docs/MILUKITA_KILL_LUKITA_TEST.md
- docs/MILUKITA_LEGAL_COMPLIANCE_CONSTITUTIONAL_AUDIT_2026-08-28.md
- docs/MILUKITA_LIVE24_ORDER_REPORT.md
- docs/MILUKITA_LIVE_DEEP_AUDIT_2026-08-28.md
- docs/MILUKITA_LIVE_IMPLEMENTATION.md
- docs/MILUKITA_LRCI_IMPLEMENTATION.md
- docs/MILUKITA_LRCI_MASTER_ORDER.md
- docs/MILUKITA_MARKETING_INTELLIGENCE.md
- docs/MILUKITA_MASTER_CONSTITUTION.md
- docs/MILUKITA_MASTER_ORDER_VALIDATION.log
- docs/MILUKITA_MASTER_REALIGNMENT_EXECUTION.md
- docs/MILUKITA_OBSERVABILITY_QA_REPORT.md
- docs/MILUKITA_P0_TV_CELULAR_UX_PROPOSAL.md
- docs/MILUKITA_P1_AUDIT_REPORT.md
- docs/MILUKITA_P2_FINAL_VALIDATION.log
- docs/MILUKITA_P3_VALIDATION.log
- docs/MILUKITA_PLATFORM_COMPATIBILITY.md
- docs/MILUKITA_PRESENTATION_INTENSITY.md
- docs/MILUKITA_QR_NEXT_EVENT_AUDIT.md
- docs/MILUKITA_SMART_TV_GUIDE.md
- docs/MILUKITA_STAGING_QA_RUNBOOK.md
- docs/MILUKITA_STATE_OF_THE_SHOW.md
- docs/MILUKITA_UX_MASTER_AUDIT.md
- docs/MJP_EXPERIENCE_OS.md
- docs/MJP_MASTER_AGENT_MAP.md
- docs/ONLINE_TV_GAMES.md
- docs/PHASE2_REALTIME_BOSS_FIGHT.md
- docs/PHASES_2_4_BOSS_LEDGER_SIMULATION.md
- docs/QA_DEVICE_CERTIFICATION.md
- docs/REALTIME.md
- docs/RNG_LEGAL_CERTIFICATION_DOSSIER.md
- docs/RNG_REGULACION_PERU_INFORME_PRELIMINAR.md
- docs/SCHEDULER.md
- docs/SECOND_SCREEN.md
- docs/STAGING_CONCURRENCY_PROTOCOL.md
- docs/TEST_MATRIX.md
- docs/TV_LINES_CLASSIFICATION.md
- docs/_audit_43_postfix_tests.log
- docs/_audit_43_validation.log
- docs/_audit_43b_browser_findings.md
- docs/auditoria-integral-programa-2026-08-25.md
- docs/bingos-y-ruletas-simplificadas-v100.md
- docs/canal-virtual-youtube-pwa-implementacion-2026-08-25.md
- docs/cartas-y-multimarket-virtual.md
- docs/catalogo-adicional-y-horarios-virtuales-v100.md
- docs/codigos-legibles-de-comprobante-v100.md
- docs/cuadro-tentativo-gastos-y-aporte-territorial.md
- docs/decisiones-priorizadas-post-auditoria.md
- docs/entity_card_multi_juegos_peru.md
- docs/evaluacion-tarifa-s1-definitiva-2026-08-25.md
- docs/idiomas-y-referencias-de-tarifa-v100.md
- docs/informe-auditoria-redondeo-y-rtp-v100.md
- docs/kyc-aml-neutral-readiness-v100.md
- docs/legacy-excel-migration.md
- docs/loterias-consuelo-v100.md
- docs/loterias-virtuales-v100.md
- docs/lotes-mixtos-y-posicionamiento-responsable-v100.md
- docs/lotes-y-tarifa-uniforme-v110.md
- docs/lukita_document81_presentation/boundaries.html
- docs/lukita_document81_presentation/closing.html
- docs/lukita_document81_presentation/cover.html
- docs/lukita_document81_presentation/document81.html
- docs/lukita_document81_presentation/domains.html
- docs/lukita_document81_presentation/frozen_architecture.html
- docs/lukita_document81_presentation/lrci_mode.html
- docs/lukita_document81_presentation/roadmap.html
- docs/lukita_document81_presentation/slide_state.json
- docs/lukita_document81_presentation/states_kpis.html
- docs/margen-probabilidades-y-pozos-responsables.md
- docs/milukita_audit_presentation/autonomy_scheduler.html
- docs/milukita_audit_presentation/conversion_optimization.html
- docs/milukita_audit_presentation/executive_summary.html
- docs/milukita_audit_presentation/lukita_identity_3d.html
- docs/milukita_audit_presentation/next_steps_roadmap.html
- docs/milukita_audit_presentation/p1_mitigation_circularity.html
- docs/milukita_audit_presentation/platform_compatibility.html
- docs/milukita_audit_presentation/slide_state.json
- docs/milukita_audit_presentation/technical_validation.html
- docs/milukita_audit_presentation/title_slide.html
- docs/milukita_audit_presentation/ux_audit_results.html
- docs/milukita_governance_presentation/audit_states.html
- docs/milukita_governance_presentation/claims_guard.html
- docs/milukita_governance_presentation/closing.html
- docs/milukita_governance_presentation/context.html
- docs/milukita_governance_presentation/cover.html
- docs/milukita_governance_presentation/legal_agent.html
- docs/milukita_governance_presentation/next_steps.html
- docs/milukita_governance_presentation/organigram.html
- docs/milukita_governance_presentation/slide_state.json
- docs/milukita_qr_circular_slides/arquitectura.html
- docs/milukita_qr_circular_slides/cierre.html
- docs/milukita_qr_circular_slides/cover.html
- docs/milukita_qr_circular_slides/diagnostico.html
- docs/milukita_qr_circular_slides/slide_state.json
- docs/milukita_qr_circular_slides/temporizador.html
- docs/milukita_qr_circular_slides/tv_dos_zonas.html
- docs/milukita_qr_circular_slides/variantes.html
- docs/milukita_qr_presentation/assets/tv-qr-reference.jpg
- docs/mjp-extra-rtp-y-aprender-v101.md
- docs/nomenclatura-y-sincronizacion-tv-digital-2026-08-25.md
- docs/nota-evaluacion-estrategia-competitiva-2026-08-24.md
- docs/nota-preliminar-equivalencia-pen-y-loterias.md
- docs/parametros-piloto-juegos.md
- docs/plan-uat-piloto.md
- docs/planes-virtuales-asistidos-v100.md
- docs/preparacion-regulatoria-peru-v100.md
- docs/privacidad-borrador-piloto.md
- docs/procedimiento-incidentes-piloto.md
- docs/reporte-cierre-loteria-api-e2e-2026-08-24.md
- docs/reporte-ingresos-egresos.csv
- docs/reporte-simulacion-50k.json
- docs/reporte-verificacion-checkpoint-6919b747.md
- docs/research-asset-3d-licensing-2026.md
- docs/research-notes-rng-regulacion-2026.md
- docs/resultados-simulador-aislado-2026-08-24.md
- docs/rtp-all-orden23.log
- docs/simplificacion-y-recalibracion-v120.md
- docs/simulador-de-practica-v100.md
- docs/tarea-26-s1-aceptacion-v102.md
- docs/tarifa-s1-staging-v101.md
- docs/tematicas-jackpot-y-cumplimiento-peru.md
- docs/tv-os-mjp-tv-manifest-guion-2026-08-25.md
- docs/validation/bundle-qa-2026-08-27.md
- docs/validation/control-room-browser-qa-2026-08-27.md
- docs/validation/controller-lab-auto-preset-json-2026-08-28.md
- docs/validation/controller-lab-drop-favorites-latency-peaks-2026-08-28.md
- docs/validation/controller-lab-native-viewport-2026-08-28.md
- docs/validation/controller-lab-profile-management-2026-08-28.md
- docs/validation/controller-lab-profile-search-latency-history-2026-08-28.md
- docs/validation/controller-lab-profiles-orientation-2026-08-28.md
- docs/validation/controller-lab-proportion-preview-2026-08-28.md
- docs/validation/controller-lab-realtime-2026-08-28.md
- docs/validation/controller-lab-reconnect-bulk-manual-code-2026-08-28.md
- docs/validation/controller-lab-tags-peaks-drop-toasts-2026-08-28.md
- docs/validation/three-tasks-rerun-2026-08-27.md
- docs/validation/touch-remote-qa-2026-08-27.md
- docs/validation/tv-hardware-qa-rerun-2026-08-27.md
- drizzle/0000_true_vertigo.sql
- drizzle/0001_flaky_avengers.sql
- drizzle/0002_solid_scalphunter.sql
- drizzle/0003_fearless_pretty_boy.sql
- drizzle/0004_demonic_power_man.sql
- drizzle/0005_fancy_gladiator.sql
- drizzle/0006_milky_kang.sql
- drizzle/0007_cynical_terror.sql
- drizzle/0008_redundant_eternity.sql
- drizzle/0009_light_nemesis.sql
- drizzle/0010_yielding_longshot.sql
- drizzle/0011_broad_chimera.sql
- drizzle/0012_giant_sharon_ventura.sql
- drizzle/0013_jazzy_phalanx.sql
- drizzle/0014_mean_xavin.sql
- drizzle/0015_classy_zaran.sql
- drizzle/0016_nasty_charles_xavier.sql
- drizzle/0017_loud_enchantress.sql
- drizzle/0018_grey_roughhouse.sql
- drizzle/0019_clumsy_captain_stacy.sql
- drizzle/0020_elite_shadow_king.sql
- drizzle/0021_huge_unus.sql
- drizzle/0022_round_pandemic.sql
- drizzle/0023_wonderful_jackal.sql
- drizzle/0024_tired_alex_wilder.sql
- drizzle/0025_clean_jack_murdock.sql
- drizzle/0026_slim_mordo.sql
- drizzle/0027_fantastic_fabian_cortez.sql
- drizzle/0028_peaceful_gargoyle.sql
- drizzle/0029_narrow_lyja.sql
- drizzle/0030_open_black_queen.sql
- drizzle/0031_slippery_karnak.sql
- drizzle/0032_needy_fat_cobra.sql
- drizzle/0033_exotic_fantastic_four.sql
- drizzle/0034_fantastic_switch.sql
- drizzle/0035_melodic_franklin_storm.sql
- drizzle/0036_slippery_warbird.sql
- drizzle/0037_odd_black_crow.sql
- drizzle/0038_broad_sue_storm.sql
- drizzle/0039_panoramic_pride.sql
- drizzle/meta/0000_snapshot.json
- drizzle/meta/0001_snapshot.json
- drizzle/meta/0002_snapshot.json
- drizzle/meta/0003_snapshot.json
- drizzle/meta/0004_snapshot.json
- drizzle/meta/0005_snapshot.json
- drizzle/meta/0006_snapshot.json
- drizzle/meta/0007_snapshot.json
- drizzle/meta/0008_snapshot.json
- drizzle/meta/0009_snapshot.json
- drizzle/meta/0010_snapshot.json
- drizzle/meta/0011_snapshot.json
- drizzle/meta/0012_snapshot.json
- drizzle/meta/0013_snapshot.json
- drizzle/meta/0014_snapshot.json
- drizzle/meta/0015_snapshot.json
- drizzle/meta/0016_snapshot.json
- drizzle/meta/0017_snapshot.json
- drizzle/meta/0018_snapshot.json
- drizzle/meta/0019_snapshot.json
- drizzle/meta/0020_snapshot.json
- drizzle/meta/0021_snapshot.json
- drizzle/meta/0022_snapshot.json
- drizzle/meta/0023_snapshot.json
- drizzle/meta/0024_snapshot.json
- drizzle/meta/0025_snapshot.json
- drizzle/meta/0026_snapshot.json
- drizzle/meta/0027_snapshot.json
- drizzle/meta/0028_snapshot.json
- drizzle/meta/0029_snapshot.json
- drizzle/meta/0030_snapshot.json
- drizzle/meta/0031_snapshot.json
- drizzle/meta/0032_snapshot.json
- drizzle/meta/0033_snapshot.json
- drizzle/meta/0034_snapshot.json
- drizzle/meta/0035_snapshot.json
- drizzle/meta/0036_snapshot.json
- drizzle/meta/0037_snapshot.json
- drizzle/meta/0038_snapshot.json
- drizzle/meta/0039_snapshot.json
- drizzle/meta/_journal.json
- drizzle/migrations/.gitkeep
- drizzle/relations.ts
- drizzle/schema.ts
- scripts/activar-modalidades-simplificadas.mts
- scripts/activar-tarifa-uniforme.mts
- scripts/agent-runtime-autonomy-test.ts
- scripts/auditar-rtp-redondeo.mjs
- scripts/bootstrap-consolation-lotteries.mjs
- scripts/build-financial-model.py
- scripts/build-luka-total-audit.mjs
- scripts/calculadora-rtp-todas.ts
- scripts/calcular-rtp-bingos-simplificados.mjs
- scripts/contrastar-adjunto-15.mjs
- scripts/convert-avatar-formats.py
- scripts/evaluar-propuesta-loterias.mjs
- scripts/load-realtime-ws.ts
- scripts/load-realtime.ts
- scripts/modelar-consuelos-y-rtp.mjs
- scripts/recalcular-tarifas-uniformes.mts
- scripts/recalibrar-loterias-con-bolas.mjs
- scripts/reporte-ingresos-egresos.ts
- scripts/run-concurrency-staging.mjs
- scripts/simulador-carga-50k.ts
- scripts/simulate-autonomy-24h.mjs
- scripts/simulate-boss-1000.ts
- scripts/simulate-boss-sensitivity.ts
- server/_core/context.ts
- server/_core/cookies.ts
- server/_core/dataApi.ts
- server/_core/env.ts
- server/_core/health.ts
- server/_core/heartbeat.ts
- server/_core/imageGeneration.ts
- server/_core/index.ts
- server/_core/llm.ts
- server/_core/map.ts
- server/_core/notification.ts
- server/_core/oauth.ts
- server/_core/requestMeta.test.ts
- server/_core/requestMeta.ts
- server/_core/sdk.ts
- server/_core/security.ts
- server/_core/securityHealth.test.ts
- server/_core/storageProxy.ts
- server/_core/systemRouter.ts
- server/_core/trpc.ts
- server/_core/types/cookie.d.ts
- server/_core/types/manusTypes.ts
- server/_core/vite.ts
- server/_core/voiceTranscription.ts
- server/api.e2e.test.ts
- server/auditReports.test.ts
- server/auditReports.ts
- server/auditor/AuditorAgent.test.ts
- server/auditor/AuditorAgent.ts
- server/auditorAgent.test.ts
- server/auditorAgent.ts
- server/auth.logout.test.ts
- server/autonomy.ts
- server/autonomyReport.test.ts
- server/autonomyReport.ts
- server/bingoRecalibration.integration.test.ts
- server/bossFightEngine.test.ts
- server/broadcast.test.ts
- server/broadcast.ts
- server/chaos/ChaosEngine.ts
- server/closeClaim.test.ts
- server/constitutionalContract.ts
- server/controllerLab.contract.test.ts
- server/controllerLab.ts
- server/db.ts
- server/entertainmentOsAgents.test.ts
- server/eventStore.ts
- server/experience/ExperienceAgent.ts
- server/experience/ExperienceDirector.ts
- server/financial/FinancialIntelligenceAgent.ts
- server/financialModel.test.ts
- server/games/bossFightEngine.ts
- server/identityParticipation.ts
- server/kycAmlReadiness.test.ts
- server/live24Runtime.ts
- server/loteria39_5.test.ts
- server/lotteryVariants.integration.test.ts
- server/lotteryVariants.test.ts
- server/lrciReviewCases.ts
- server/lukita/LukitaVoiceEngine.ts
- server/lukitaScripts.test.ts
- server/lukitaScripts.ts
- server/mjpExtra.test.ts
- server/newGames.test.ts
- server/onlineTvGames.replay.test.ts
- server/onlineTvGames.test.ts
- server/onlineTvGames.ts
- server/onlineTvPersistence.ts
- server/p1HealthRecovery.test.ts
- server/pilot.test.ts
- server/pilot.ts
- server/productAnalytics.ts
- server/qrTimerPalettes.ts
- server/realtime/playerSessionManager.test.ts
- server/realtime/playerSessionManager.ts
- server/realtime/router.ts
- server/realtime/websocketServer.test.ts
- server/realtime/websocketServer.ts
- server/recovery/RecoveryEngine.ts
- server/rewardLedger.test.ts
- server/rewards/persistentRewardLedger.ts
- server/rewards/rewardLedger.ts
- server/routers.ts
- server/routers/bossFight.ts
- server/routers/onlineTvGames.ts
- server/routers/rewards.ts
- server/scheduledGames.ts
- server/scheduledLive24.ts
- server/scheduler/SchedulerService.ts
- server/scheduler/concurrencyIsolation.test.ts
- server/scheduler/dualInstanceSimulation.test.ts
- server/scheduler/dualInstanceSimulation.ts
- server/schedulerEngine.ts
- server/scripts/activateLotteryVariants.ts
- server/scripts/activateMjpExtra39.ts
- server/scripts/activateRecalibrationV120.ts
- server/scripts/analyzeLotteryVariants.ts
- server/simplifiedGames.integration.test.ts
- server/simulateLive.ts
- server/simulator/README.md
- server/simulator/config.ts
- server/simulator/database.ts
- server/simulator/engine.ts
- server/simulator/index.ts
- server/simulator/loadGenerator.ts
- server/simulator/metricsCollector.ts
- server/simulator/random.ts
- server/simulator/reporter.ts
- server/simulator/simulator.test.ts
- server/simulator/types.ts
- server/storage.ts
- server/supervisedWorker.test.ts
- server/supervisedWorker.ts
- server/ticketIdentifiers.test.ts
- server/tvManifest.test.ts
- server/tvOverlay.e2e.test.ts
- server/watchdog/WatchdogAgent.ts
- server/youtubeLive.test.ts
- server/youtubeLive.ts
- shared/_core/errors.ts
- shared/agentAutonomyBacklog.test.ts
- shared/agentAutonomyBacklog.ts
- shared/agentGovernance.test.ts
- shared/agentGovernance.ts
- shared/agentMap.test.ts
- shared/agentMap.ts
- shared/agentMaturityGate.test.ts
- shared/agentMaturityGate.ts
- shared/agentRegistry.test.ts
- shared/agentRegistry.ts
- shared/agentRuntimeAutonomy.test.ts
- shared/agentRuntimeAutonomy.ts
- shared/agentSafeCapability.test.ts
- shared/agentSafeCapability.ts
- shared/analyticsResilience.test.ts
- shared/analyticsResilience.ts
- shared/assistedPlans.ts
- shared/auditSummary.test.ts
- shared/auditSummary.ts
- shared/autonomyDashboard.test.ts
- shared/autonomyDashboard.ts
- shared/autonomyEngine.ts
- shared/autonomySimulation.test.ts
- shared/autonomySimulation.ts
- shared/avatarScripts.ts
- shared/bossFight.ts
- shared/brandSystem.test.ts
- shared/brandSystem.ts
- shared/characterOs.test.ts
- shared/characterOs.ts
- shared/circularQr.test.ts
- shared/circularQr.ts
- shared/commercialOs.test.ts
- shared/commercialOs.ts
- shared/const.ts
- shared/content78Contracts.test.ts
- shared/contentEngine.ts
- shared/contingencyEngine.test.ts
- shared/contingencyEngine.ts
- shared/controlRoomAccessibility.test.ts
- shared/controlRoomSearch.test.ts
- shared/controlRoomSearch.ts
- shared/controllerLab.test.ts
- shared/controllerLab.ts
- shared/distributionOs.test.ts
- shared/distributionOs.ts
- shared/distributionReadiness.test.ts
- shared/distributionReadiness.ts
- shared/downloadCompat.test.ts
- shared/downloadCompat.ts
- shared/entertainmentOs.test.ts
- shared/entertainmentOs.ts
- shared/entertainmentOsArchitecture.test.ts
- shared/entertainmentOsModules.test.ts
- shared/eventEngine.ts
- shared/eventExperience.test.ts
- shared/experienceDirector.test.ts
- shared/experienceDirector.ts
- shared/experienceEngine.test.ts
- shared/experienceEngine.ts
- shared/experienceOrchestrator.test.ts
- shared/experienceOrchestrator.ts
- shared/experienceQualityOs.ts
- shared/fastReadiness.test.ts
- shared/fastReadiness.ts
- shared/financialIntelligence.test.ts
- shared/financialIntelligence.ts
- shared/financialModel.ts
- shared/financialOs.ts
- shared/gameRegistry.ts
- shared/health.ts
- shared/identityAnalytics.test.ts
- shared/identityAnalytics.ts
- shared/identityParticipation.test.ts
- shared/identityParticipation.ts
- shared/interactionEngine.ts
- shared/kycAmlReadiness.ts
- shared/legalAgent.test.ts
- shared/legalAgent.ts
- shared/legalComplianceAgent.test.ts
- shared/legalComplianceAgent.ts
- shared/live24.test.ts
- shared/live24.ts
- shared/liveChannel.test.ts
- shared/liveChannel.ts
- shared/lotteryVariants.ts
- shared/lrciReviewCaseContract.test.ts
- shared/lukaControlPacks.test.ts
- shared/lukaControlPacks.ts
- shared/lukaLaunchRegistry.test.ts
- shared/lukaLaunchRegistry.ts
- shared/lukaOsContract.test.ts
- shared/lukaOsContract.ts
- shared/lukaRuntimeContract.test.ts
- shared/lukaRuntimeContract.ts
- shared/lukita3dRecovery.test.ts
- shared/lukita3dRecovery.ts
- shared/lukita3dSpec.test.ts
- shared/lukita3dSpec.ts
- shared/lukitaArStageContract.test.ts
- shared/lukitaCharacterFoundation.test.ts
- shared/lukitaCharacterFoundation.ts
- shared/lukitaGeoGovernance.test.ts
- shared/lukitaGeoGovernance.ts
- shared/lukitaGeoPlacement.test.ts
- shared/lukitaGeoPlacement.ts
- shared/lukitaLiveArchitecture.test.ts
- shared/lukitaLiveArchitecture.ts
- shared/lukitaLiveBoundaries.test.ts
- shared/lukitaLiveBoundaries.ts
- shared/lukitaLiveCaptureContract.test.ts
- shared/lukitaLiveCaptureContract.ts
- shared/lukitaPointPublication.test.ts
- shared/lukitaPointPublication.ts
- shared/lukitaScripts.test.ts
- shared/lukitaScripts.ts
- shared/manifestTiming.test.ts
- shared/manifestTiming.ts
- shared/manifestUi.test.ts
- shared/manifestUi.ts
- shared/marketingIntelligence.test.ts
- shared/marketingIntelligence.ts
- shared/milukitaConsolidation.test.ts
- shared/milukitaConsolidation.ts
- shared/milukitaMasterOrder.test.ts
- shared/milukitaMasterOrder.ts
- shared/mjpCoreIsolation.test.ts
- shared/observabilityContract.test.ts
- shared/observabilityContract.ts
- shared/onlineTvGames.ts
- shared/order25.e2e.test.ts
- shared/order25Engines.test.ts
- shared/productAnalyticsBeaconContract.test.ts
- shared/profileSessionFeatures.test.ts
- shared/qrExpiry.test.ts
- shared/qrExpiry.ts
- shared/qrTimerPalette.test.ts
- shared/qrTimerPalette.ts
- shared/realtime.ts
- shared/regulatoryReadiness.ts
- shared/retentionEvents.test.ts
- shared/retentionEvents.ts
- shared/roundState.test.ts
- shared/roundState.ts
- shared/sandboxAgentSecurity.test.ts
- shared/showState.test.ts
- shared/showState.ts
- shared/simplifiedGames.test.ts
- shared/simplifiedGames.ts
- shared/smartTvSimulationContract.test.ts
- shared/smartTvSimulationContract.ts
- shared/ticketIdentifiers.ts
- shared/touchRemoteContract.test.ts
- shared/tvManifest.ts
- shared/tvQrGoldenFlow.test.ts
- shared/types.ts
- shared/virtualCredits.ts
- shared/virtualPrizeRounding.test.ts
- shared/virtualPrizeRounding.ts
- ./.gitignore
- ./.gitkeep
- ./.prettierignore
- ./.prettierrc
- ./.project-config.json
- ./MILUKITA_BRAND_SYSTEM.md
- ./MILUKITA_REBRAND_AUDIT.md
- ./MJP_ESTADO_SITUACIONAL_AUDITORIA_EXHAUSTIVA.md
- ./MJP_INFORME_UNIFICADO_DETALLES_Y_AUDITORIA.md
- ./MJP_MASTER_IMPLEMENTATION_AUDIT.md
- ./MJP_MODELO_FINANCIERO_PERU_2026.md
- ./MJP_MODELO_FINANCIERO_PERU_2026.xlsx
- ./MJP_ORDER25_FINAL_AUDIT.md
- ./MJP_PROXIMAS_ACTIVIDADES.md
- ./MJP_SYSTEM_AUDIT_ORDER25.md
- ./components.json
- ./drizzle.config.ts
- ./package.json
- ./pnpm-lock.yaml
- ./run-sandbox-audit.sh
- ./template.json
- ./todo.md
- ./tsconfig.json
- ./vite.config.ts
- ./vitest.config.ts

### 2.3 Dependencias declaradas

| Paquete | Versión declarada | Clasificación |
|---|---|---|
| @aws-sdk/client-s3 | ^3.693.0 | Producción |
| @aws-sdk/s3-request-presigner | ^3.693.0 | Producción |
| @hookform/resolvers | ^5.2.2 | Producción |
| @radix-ui/react-accordion | ^1.2.12 | Producción |
| @radix-ui/react-alert-dialog | ^1.1.15 | Producción |
| @radix-ui/react-aspect-ratio | ^1.1.7 | Producción |
| @radix-ui/react-avatar | ^1.1.10 | Producción |
| @radix-ui/react-checkbox | ^1.3.3 | Producción |
| @radix-ui/react-collapsible | ^1.1.12 | Producción |
| @radix-ui/react-context-menu | ^2.2.16 | Producción |
| @radix-ui/react-dialog | ^1.1.15 | Producción |
| @radix-ui/react-dropdown-menu | ^2.1.16 | Producción |
| @radix-ui/react-hover-card | ^1.1.15 | Producción |
| @radix-ui/react-label | ^2.1.7 | Producción |
| @radix-ui/react-menubar | ^1.1.16 | Producción |
| @radix-ui/react-navigation-menu | ^1.2.14 | Producción |
| @radix-ui/react-popover | ^1.1.15 | Producción |
| @radix-ui/react-progress | ^1.1.7 | Producción |
| @radix-ui/react-radio-group | ^1.3.8 | Producción |
| @radix-ui/react-scroll-area | ^1.2.10 | Producción |
| @radix-ui/react-select | ^2.2.6 | Producción |
| @radix-ui/react-separator | ^1.1.7 | Producción |
| @radix-ui/react-slider | ^1.3.6 | Producción |
| @radix-ui/react-slot | ^1.2.3 | Producción |
| @radix-ui/react-switch | ^1.2.6 | Producción |
| @radix-ui/react-tabs | ^1.1.13 | Producción |
| @radix-ui/react-toggle | ^1.1.10 | Producción |
| @radix-ui/react-toggle-group | ^1.1.11 | Producción |
| @radix-ui/react-tooltip | ^1.2.8 | Producción |
| @tanstack/react-query | ^5.90.2 | Producción |
| @trpc/client | ^11.6.0 | Producción |
| @trpc/react-query | ^11.6.0 | Producción |
| @trpc/server | ^11.6.0 | Producción |
| @types/three | ^0.185.4 | Producción |
| axios | ^1.12.0 | Producción |
| class-variance-authority | ^0.7.1 | Producción |
| clsx | ^2.1.1 | Producción |
| cmdk | ^1.1.1 | Producción |
| cookie | ^1.0.2 | Producción |
| date-fns | ^4.1.0 | Producción |
| dotenv | ^17.2.2 | Producción |
| drizzle-orm | ^0.44.5 | Producción |
| embla-carousel-react | ^8.6.0 | Producción |
| express | ^4.21.2 | Producción |
| express-rate-limit | ^8.6.2 | Producción |
| framer-motion | ^12.23.22 | Producción |
| helmet | ^8.3.0 | Producción |
| input-otp | ^1.4.2 | Producción |
| jose | 6.1.0 | Producción |
| lucide-react | ^0.453.0 | Producción |
| mysql2 | ^3.15.0 | Producción |
| nanoid | ^5.1.5 | Producción |
| next-themes | ^0.4.6 | Producción |
| pdfkit | ^0.20.1 | Producción |
| qrcode | ^1.5.4 | Producción |
| react | ^19.2.1 | Producción |
| react-day-picker | ^9.11.1 | Producción |
| react-dom | ^19.2.1 | Producción |
| react-hook-form | ^7.64.0 | Producción |
| react-resizable-panels | ^3.0.6 | Producción |
| recharts | ^2.15.2 | Producción |
| sonner | ^2.0.7 | Producción |
| streamdown | ^1.4.0 | Producción |
| superjson | ^1.13.3 | Producción |
| tailwind-merge | ^3.3.1 | Producción |
| tailwindcss-animate | ^1.0.7 | Producción |
| three | ^0.185.1 | Producción |
| vaul | ^1.1.2 | Producción |
| wouter | ^3.3.5 | Producción |
| ws | ^8.21.3 | Producción |
| zod | ^4.1.12 | Producción |
| @builder.io/vite-plugin-jsx-loc | ^0.1.1 | Desarrollo / validación |
| @tailwindcss/typography | ^0.5.15 | Desarrollo / validación |
| @tailwindcss/vite | ^4.1.3 | Desarrollo / validación |
| @types/express | 4.17.21 | Desarrollo / validación |
| @types/google.maps | ^3.58.1 | Desarrollo / validación |
| @types/node | ^24.7.0 | Desarrollo / validación |
| @types/pdfkit | ^0.17.6 | Desarrollo / validación |
| @types/qrcode | ^1.5.6 | Desarrollo / validación |
| @types/react | ^19.2.1 | Desarrollo / validación |
| @types/react-dom | ^19.2.1 | Desarrollo / validación |
| @types/ws | ^8.18.1 | Desarrollo / validación |
| @vitejs/plugin-react | ^5.0.4 | Desarrollo / validación |
| add | ^2.0.6 | Desarrollo / validación |
| autoprefixer | ^10.4.20 | Desarrollo / validación |
| drizzle-kit | ^0.31.4 | Desarrollo / validación |
| esbuild | ^0.25.0 | Desarrollo / validación |
| playwright-core | ^1.62.1 | Desarrollo / validación |
| pnpm | ^10.15.1 | Desarrollo / validación |
| postcss | ^8.4.47 | Desarrollo / validación |
| prettier | ^3.6.2 | Desarrollo / validación |
| tailwindcss | ^4.1.14 | Desarrollo / validación |
| tsx | ^4.19.1 | Desarrollo / validación |
| tw-animate-css | ^1.4.0 | Desarrollo / validación |
| typescript | 5.9.3 | Desarrollo / validación |
| vite | ^7.1.7 | Desarrollo / validación |
| vite-plugin-manus-runtime | 0.0.59 | Desarrollo / validación |
| vitest | ^2.1.4 | Desarrollo / validación |

No se observaron SDKs productivos de Google Cast, Tizen, Roku, webOS, DLNA/UPnP, Matter o proveedores IoT. ws, Three.js, APIs de navegador, QRCode y tRPC soportan superficies web y simulación, no certifican conectividad física.

## 3. Arquitectura y flujo operativo

~~~text
[Usuario] -- voz / toque / teclado / gesto --> [LUKA Universal Entry]
[LUKA Universal Entry] -- intención + confirmación + permisos --> [Capability Registry]
[Capability Registry] -- available --> [Visor AR territorial] / [LUKA TV Runtime]
[Capability Registry] -- hidden --> [packs secundarios no revelados]
[Device Detector simulado] --> [Control Pack contextual]
[TV Runtime simulado] --> [pantalla virtual + LRUD + fallback QR]
[Visor AR] --> [cámara / GPS / WebXR cuando el navegador lo permite]
[Presentación] -- prohibido --> [RNG / RTP / wallet / ledger / settlement / MjpTvManifest]
~~~

### 3.1 Procesos y protocolos

| Proceso | Implementación actual | Estado |
|---|---|---|
| UI web | React 19, Vite, Tailwind y Radix | Activo |
| API | Express, tRPC y SuperJSON | Activo en sandbox |
| Identidad | Manus OAuth y sesión | Preparado / activo según ruta |
| Simulación | Estado local y contratos tipados | Activo |
| WebSocket | Transporte de Controller Lab | Preparado; no equivale a TV real |
| Persistencia | Drizzle/MySQL/TiDB y localStorage de drafts | Mixto |
| Media | Cámara, micrófono, captura AR y QR | Permiso contextual |
| AR | WebXR, Three.js y GLB placeholder | Depende del dispositivo |

## 4. Capability Registry de lanzamiento

| Capability | Estado | Superficie |
|---|---|---|
| ar-visor — LUKA Visor AR / Guía territorial | AVAILABLE | Entrada LUKA |
| luka-tv — LUKA TV | AVAILABLE | Entrada LUKA |
| tv — TV Control Pack | AVAILABLE | Contexto TV |
| Trackpad / Keyboard / Gamepad | HIDDEN | Fase posterior |
| Lights & Climate / Audio | HIDDEN | Fuera del MVP |
| Wearables / Vehicle Dashboard | HIDDEN | Integraciones reservadas |
| Moneda L* | HIDDEN | No disponible en Fase 1 |

La ocultación es una política de interfaz y no una autoridad. Un comando dirigido a un pack oculto devuelve una respuesta de fase posterior y alternativas de lanzamiento; no abre el modo ni toca el núcleo.

## 5. Organigrama constitucional

| Nivel | Entidad | Responsabilidad | Autoridad |
|---|---|---|---|
| 1 | Proyecto MiLukita | Visión, producto y prioridades | Propietario / Human Authority |
| 2 | LUKA OS | Contexto, intención, disclosure y superficies | Presentation / Experience only |
| 3 | Visor AR + LUKA TV | Experiencias MVP | Acciones de presentación autorizadas |
| 4 | Manus AI | Desarrollo, pruebas y documentación | No gobierna producto ni MJP CORE |
| 5 | MJP CORE | Verdad del juego, RNG, RTP, ledger, settlement y reglas | Protected Core |

Los agentes y laboratorios pueden proponer, simular, medir o presentar. No pueden modificar resultados, RNG, RTP, wallet, ledger, settlement, reglas ni manifestos del núcleo.

## 6. Visión de LUKA

LUKA se modela como una presencia contextual, no como una aplicación que expone un menú completo. Escucha una intención, confirma cuando corresponde, solicita permisos solo al necesitarlos y revela la superficie apropiada. En Fase 1, LUKA aparece en AR, ayuda a explorar el territorio y actúa como anfitriona práctica del TV.

## 7. Implementado, reservado y bloqueado

| Grupo | Implementado en sandbox | Reservado / bloqueado | Gate requerido |
|---|---|---|---|
| AR | Entrada, permisos, placeholder, controles y diálogo | WebXR universal, GPS continuo, modelo definitivo | QA físico y Character Foundation |
| TV | Simulador, LRUD, perfiles, QR y pantalla virtual | Cast, TWA, DLNA/UPnP y SDKs | SDKs, dispositivos, red y revisión |
| Voz | Resolución, sugerencias, historial y confirmación | Wake word real menor de 200 ms, ASR/NLU | Proveedor y medición en hardware |
| Detector | Fuentes y telemetría simuladas | Escaneo nativo Wi-Fi/Bluetooth | APIs, permisos y threat model |
| Hogar | Luces simuladas con foco e intensidad | Matter, hubs y dispositivos reales | Pairing, revocación y auditoría |
| MJP CORE | Aislado, sin cambios | Cualquier escritura desde presentación | Prohibición constitucional |

## 8. Deuda técnica, riesgos y huérfanas

No se certificó código muerto mediante análisis estático completo; las funciones huérfanas quedan como NO DETERMINADAS. Se observaron chunks grandes de Three.js y vendor React, un asset /manus-storage que se resuelve en runtime y advertencias de configuración de pnpm. No bloquearon el build, pero deben priorizarse antes de alto tráfico.

Los riesgos principales son confundir simulación con conexión, solicitar permisos demasiado pronto, carecer de QA física y revelar capacidades ocultas como productivas. Etiquetas, disclosure, confirmación y límites de autoridad mitigan parcialmente estos riesgos.

## 9. Validación reproducible

| Control | Resultado |
|---|---|
| TypeScript | PASS |
| Suite Vitest | 422 pruebas PASS; 4 omitidas |
| Archivos de prueba | 118 PASS; 1 omitido |
| Build Vite + esbuild | PASS |
| Aislamiento MJP CORE | PASS en contratos y pruebas disponibles |
| QA visual | Ejecutada en sandbox; no sustituye QA física |
| Dispositivos reales | NO EJECUTADO |
| Integraciones Cast/Tizen/webOS/Roku reales | NO INTEGRADO |

### 9.1 Hashes de evidencia

| Archivo | SHA-256 |
|---|---|
| shared/lukaLaunchRegistry.ts | 6ccdcefa17c48c393b80563ed43ca34cb531af1eae29a3f67a3844a2505a9503 |
| shared/lukaOsContract.ts | 78685991ecc8724f0203b70b8a119eec3d444cae7944bba78431409be22b36dc |
| shared/lukaControlPacks.ts | 52b3b5fda8fd9eee0a606366d1987c64a8e3c7a242ffb319942f092dac0d6f12 |
| shared/lukaRuntimeContract.ts | 44f94d7f491ab3dfe3f2c938c7a4321863266ed2a4fc23db5568168fe8585a1d |
| shared/smartTvSimulationContract.ts | 4e3c503cc9eb47ec2437d47a64836bff95d00348f0585dabb13b7f40f0d77c39 |
| client/src/components/LukaUniversalEntry.tsx | 5d0198a5bc9af8d15da43acc0d2adc9533e440a8348333f96b9c2002eb77641f |
| client/src/components/LukaRuntimeLab.tsx | 2d46619b1769b1c554c6f86a3f5949e12e41d8b179612e78613af8883b9d19ee |
| client/src/components/SmartTvConnectionSimulator.tsx | 04cc982de0f42da1ab1e92c3ebbfaaf6b8d878f17c4f566c178d27e42f7b20e4 |
| docs/LUKA_OS_SPEC_V1_IMPLEMENTATION.md | 705c4b5611768c889097fa78f8fd4da3fe94c925384b87b136d97e08b69f3f83 |

## 10. Recomendación de actualización segura

Congelar el MVP; ejecutar QA en teléfonos y perfiles Android TV; definir Character Foundation y permisos de ubicación; seleccionar un proveedor de voz; integrar un único conector de TV en staging; auditar logs, revocación, timeouts y aislamiento; y decidir producción solo después de esos gates.

No se recomienda actualizar MJP CORE para habilitar superficies. Las nuevas capacidades deben consumir contratos de lectura y comandos de presentación, con prohibición expresa de escribir en resultados o contabilidad.

## 11. Checklist externo

| Verificación | Estado al corte |
|---|---|
| Integridad del expediente mediante SHA-256 | Pendiente del auditor externo |
| Disclosure solo AR/TV | Implementado en sandbox |
| TV simulado: flechas, Enter, Back, perfiles y QR | Implementado en sandbox |
| Voz: 10 comandos, confirmación y rechazo | Implementado en sandbox |
| AR en dispositivos físicos | Pendiente |
| Diff de MJP CORE | Sin cambios observados en esta auditoría |

## 12. Declaración final

Este documento es una auditoría técnica de preparación y estado; no es certificación de producción, compatibilidad universal, seguridad legal ni integración de hardware. La afirmación correcta es: LUKA Fase 1 está implementada y verificable en sandbox, mientras conectores físicos y pruebas de campo permanecen pendientes.

Referencias internas: docs/LUKA_OS_SPEC_V1_IMPLEMENTATION.md; docs/LUKA_OS_PHASES_3_8_SANDBOX_AUDIT.md; shared/lukaLaunchRegistry.ts; shared/lukaOsContract.ts; shared/lukaControlPacks.ts; shared/lukaRuntimeContract.ts; shared/smartTvSimulationContract.ts.


---

## Addendum de consolidación nominal y publicación — 2026-09-01

La auditoría nominal `MILUKITA-BRAND-FREEZE-001` fue revisada y se adopta un freeze selectivo: el material nuevo usa MiLukita/LUKA/LUKA OS/LUKA AR/LUKA TV según el glosario canónico; las variantes Lukallpa, LUKITA y Lukita se conservan cuando pertenecen a evidencia histórica, pruebas, assets o compatibilidad. No se ejecutó un reemplazo global ciego.

El expediente complementario `docs/LUKA_CANONICAL_GLOSSARY_AND_PUBLICATION_RISK_MATRIX_2026-09-01.md` registra el glosario, la cláusula exacta de congelamiento funcional, la matriz de riesgos de marca/publicación, los quality gates y el estado real de los agentes. `docs/TRADEMARK_REVIEW_SOURCES_2026-09-01.md` conserva las fuentes oficiales consultadas.

El material comercial activo `client/src/pages/CommercialPage.tsx` fue alineado de forma selectiva: ahora se identifica como `MiLukita Commercial OS · Control Room` y se declara gobernado sobre `LUKA OS / Experience OS`. No se modificaron documentos históricos ni superficies del MJP CORE.

La revisión no determina disponibilidad, registrabilidad ni ausencia de conflicto para ninguna marca o logotipo. Antes de publicación o registro se requiere búsqueda por denominación, fonética, clase y similitud figurativa en INDECOPI/WIPO, además de revisión profesional. Los agentes permanecen sin autoridad sobre RNG, RTP, wallet, ledger, settlement, reglas, resultados o manifiestos protegidos.
