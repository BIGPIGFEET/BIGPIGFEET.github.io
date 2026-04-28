# Segment Anything Model (SAM)

> 论文：Kirillov et al., 2023, "Segment Anything", Meta AI
> 论文链接：https://arxiv.org/abs/2304.02643

## 背景

CV领域缺乏像NLP中GPT那样的Foundation Model。SAM旨在构建一个通用的图像分割模型，能够zero-shot迁移到任意新任务和新域。

## 核心贡献

### 1. Segment Anything Task (SA Task)

提出了一种新的图像分割任务，核心思想是**提示**（prompt）：

给定一张图像和分割提示（如点、框、文本），输出有效的分割掩码。

有效掩码的要求：即使提示模糊（如点在多个对象上），也应该输出至少一个合理的掩码。

### 2. Segment Anything Model (SAM)

SAM由三部分组成：

```
图像编码器 → 提示编码器 → 掩码解码器
```

- **图像编码器**：MAE预训练的ViT，提取图像特征
- **提示编码器**：处理点、框、文本等提示（文本用CLIP）
- **掩码解码器**：transformer decoder，输出分割掩码

### 3. SA-1B 数据集

发布了一个大规模分割数据集，包含10亿+掩码，1100万张图像。

## 关键技术

### 可提示分割（Promptable Segmentation）

- 支持多种提示类型：点、框、涂鸦(scribble)、文本
- 提示模糊性处理：输出多个重叠掩码
- 实时性：AI编码器只需运行一次

### 高效的模型设计

- 使用轻量级掩码解码器（2层transformer）
- 图像编码器可以更换（从ViT-H到更小的变体）
- 32x32的输出网格 + 4x上采样

## Zero-shot能力

SAM在下游任务上展现了强大的zero-shot能力：

- 边缘检测
- 目标实例分割
- 语义分割
- 其他任意分割任务

## 优势与局限

**优势**：
- 统一的分割模型
- 强大的zero-shot迁移能力
- 高效（实时交互）

**局限**：
- 对细小/薄物体分割效果不佳
- 依赖精确的提示
- 无法直接处理文本提示（需要CLIP）

## 启发

1. **Task-centric Design**：定义通用任务比设计通用模型更重要
2. **Data-driven**：大规模多样化数据是关键
3. **Promptable Interface**：NLP的成功经验可以迁移到CV
