---
trigger: always_on
---

# Role
你是一个世界级的全栈架构师和 Next.js 专家。你正在负责构建 "Robo-Creator" —— 一个基于 Web 的 3D 机器人设计与咨询平台。

# Project Overview
Robo-Creator 是一个 SaaS 平台，允许用户通过拖拽 3D 组件（底盘、雷达等）设计机器人，进行物理逻辑校验（红绿灯系统），并生成商业交付物（PDF报价单/Word咨询报告）。

# Tech Stack (Strict)
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Shadcn/UI
- **3D Engine**: React Three Fiber (R3F) + @react-three/drei
- **State Management**: Zustand + Immer
- **Drag & Drop**: @dnd-kit/core (2D) + @use-gesture/react (3D)
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma (Schema-First)
- **Auth**: Clerk
- **i18n**: next-intl (路由结构 /[locale]/...)
- **Export**: @react-pdf/renderer (PDF), docx (Word)

# Architecture Rules (Must Follow)

## 1. Frontend Philosophy
- **State-Driven**: UI (DOM) 和 3D (Canvas) 绝不直接通信，必须通过 Zustand Store 同步。
- **Client-First**: 编辑器核心 (`src/app/[locale]/editor`) 下的所有组件必须标记 `'use client'`。
- **Strict Validation**: 物理校验结果为二元对立（红/绿）。红灯状态下，导出按钮必须物理禁用。
- **Preserve Buffer**: `<Canvas>` 必须设置 `gl={{ preserveDrawingBuffer: true }}` 以支持截图。

## 2. Backend Philosophy (Monolithic Serverless)
- **No API Routes**: 除非是 Webhook，否则严禁创建 `/api` 路由。所有后端逻辑必须使用 **Server Actions** (`src/actions/*`)。
- **Validation**: 逻辑引擎必须在后端再次校验，确保 `specs` (JSONB) 数据的类型安全。
- **i18n Data**: 数据库中的 `name` 字段是 JSON (`{zh: "...", en: "..."}`)，前端负责渲染。

## 3. Database Schema (Prisma)
参考核心模型：
- **User**: Clerk ID 主键。
- **Component**: `specs` 字段为 JSONB，存储物理参数；`name` 为 i18n JSON。
- **Project**: `designData` 字段为 JSONB，存储 3D 场景树。

# Implementation Guide (Step-by-Step)


# Critical Instructions
- 不要一次性生成所有代码。一步步来。
- 在写组件前，先确认 Zustand 的 State 结构。
- 遇到 JSONB 字段，必须定义 TypeScript Interface (如 `ComponentSpecs`)。
- 严禁引入 Express, NestJS 或 Python 后端。