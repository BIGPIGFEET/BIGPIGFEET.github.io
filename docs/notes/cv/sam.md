# Segment Anything Model (SAM)

> 论文：Kirillov et al., 2023, "Segment Anything", arXiv:2304.02643, Meta AI

## 1. 研究背景与动机

图像分割（Image Segmentation）是计算机视觉（Computer Vision, CV）领域的核心任务之一，其目标是将图像划分为多个具有语义意义的区域。然而，在SAM出现之前，深度学习时代的图像分割面临着显著的碎片化问题：实例分割（Instance Segmentation）、语义分割（Semantic Segmentation）、全景分割（Panoptic Segmentation）等任务通常需要独立的模型架构和专门的数据集训练，这种碎片化的范式严重制约了通用视觉智能的发展。

与此同时，自然语言处理（Natural Language Processing, NLP）领域已经成功建立了"预训练-微调"（Pre-train, then Fine-tune）的Foundation Model范式。以GPT系列为代表的大语言模型（Large Language Model, LLM）通过大规模预训练和指令微调（Instruction Tuning），实现了在下游任务上的卓越zero-shot迁移能力。然而，计算机视觉领域始终缺乏类似的通用分割基础模型。

SAM的核心动机正是构建一个能够**zero-shot**（零样本迁移）到任意新任务和新领域的图像分割基础模型。研究者们提出了三个核心问题：1）什么样的任务定义能够统一各类分割需求？2）对应的模型架构如何设计？3）如何构建大规模训练数据？

## 2. 任务定义：Segment Anything Task (SA Task)

### 2.1 任务形式化

SAM论文提出了**Segment Anything Task (SA Task)**，这是一种可提示的分割任务（Promptable Segmentation Task）。形式化地，给定：

- 输入图像 $I \in \mathbb{R}^{H \times W \times 3}$
- 分割提示（Prompt）$p \in \mathcal{P}$，其中 $\mathcal{P}$ 表示所有可能的提示空间

模型需要输出**有效分割掩码**（Valid Segmentation Mask）$M \in \{0, 1\}^{H \times W}$。

### 2.2 提示类型

SAM支持的提示类型包括：

- **点（Point）**：包括前景点（positive point）和背景点（negative point）
- **框（Bounding Box）**：由左上角和右下角坐标定义
- **涂鸦（Scribble）**：自由形式的笔画
- **文本（Text）**：自然语言描述，通过CLIP编码

### 2.3 有效掩码的判定标准

SA Task的一个核心设计是要求模型输出**有效掩码**（Valid Mask）。即使提示存在歧义性（ambiguous），例如一个点落在多个重叠物体上，模型也应该输出至少一个合理的结果。这一设计约束确保了模型在各种模糊场景下的鲁棒性。

### 2.4 与相关任务的关系

SA Task具有足够的通用性，可以统一多种下游分割任务：

- **语义分割**：将文本提示设为类别名称
- **实例分割**：将框提示设为检测框
- **边缘检测**：将点提示设在边缘位置

## 3. 模型架构：Segment Anything Model

SAM的架构遵循标准的encode-decoder范式，由三个核心组件构成：

### 3.1 图像编码器（Image Encoder）

图像编码器采用基于**Vision Transformer (ViT)**的架构，具体使用MAE（Masked Autoencoder）预训练的ViT-H模型。ViT将输入图像划分为非重叠的patches（通常为16×16像素），然后通过多层Transformer块处理，生成密集的特征图（Feature Map）。

**Vision Transformer (ViT)** 是一种将Transformer架构应用于图像分类的模型。不同于传统的卷积神经网络（Convolutional Neural Network, CNN），ViT将图像视为序列问题进行处理：首先将图像划分为patches，然后将这些patches线性嵌入为token，输入标准Transformer encoder。

**MAE（Masked Autoencoder）** 是一种自监督预训练方法，采用非对称编码器-解码器结构。训练时随机遮盖（mask）输入图像的patches（如75%），然后让解码器重建被遮盖的像素值。这种预训练方式使编码器学习到丰富的视觉表征。

图像编码器的输出是图像嵌入（Image Embedding）$E \in \mathbb{R}^{N \times D}$，其中 $N$ 是特征图中的位置数，$D$ 是特征维度（对于ViT-H，$D=1280$）。

### 3.2 提示编码器（Prompt Encoder）

提示编码器负责将各种形式的提示转换为嵌入向量：

- **点和框**：使用**FOA（Freely-ordered Anchors）**编码，结合位置编码（Positional Encoding）和语义特征
- **掩码提示**：使用卷积编码
- **文本提示**：使用CLIP（Contrastive Language-Image Pre-training）的文本编码器

**CLIP** 是OpenAI提出的对比语言-图像预训练模型，能够学习图像和文本的联合嵌入空间。通过CLIP编码的文本提示可以在语义层面指导分割。

### 3.3 掩码解码器（Mask Decoder）

掩码解码器是一个轻量级的Transformer decoder，其输入包括：

- 图像嵌入 $E$
- 提示嵌入 $P$
- 可学习的output token

解码器通过cross-attention和self-attention机制，逐步细化分割预测。输出层使用焦损失（Focal Loss）和Dice损失的组合进行训练。

SAM的掩码解码器输出三个重叠的掩码，对应三种不同的分辨率（原始分辨率、4×下采样、4×下采样后上采样），以处理不同尺度的物体。

## 4. 训练策略：可提示分割的弱监督学习

SAM的训练采用一种巧妙的**弱监督学习**策略。由于缺乏大规模的点-掩码配对数据，论文设计了以下训练范式：

1. 模拟各种提示类型（点、框、文本等）
2. 给定图像和提示，预测对应的有效掩码
3. 使用Focal Loss和Dice Loss的加权和作为损失函数

训练过程中，提示的模拟方式包括：随机采样点、从真实掩码生成框、从语义类别生成文本描述等。

## 5. 数据集：SA-1B

SAM论文发布了**SA-1B数据集**，这是迄今为止最大的图像分割数据集：

- 包含约1100万张精选图像
- 共计超过10亿个高质量分割掩码
- 掩码的平均分辨率为约100×100像素

数据收集采用**半自动标注**策略：首先使用SAM的早期版本生成初始掩码，然后由人工标注员进行校正和补充。这种人机协作的方式有效平衡了标注质量和成本。

## 6. 实验结果与Zero-shot迁移能力

SAM在多个下游任务上展现了卓越的zero-shot迁移能力：

### 6.1 边缘检测

在BSDS500数据集上，SAM作为边缘检测器使用时，无需任何微调即可达到与专用方法相当的性能。通过在边缘位置采样点提示，SAM能够生成精细的边缘分割结果。

### 6.2 实例分割

SAM可以与目标检测器（如DINO）结合，实现zero-shot实例分割。将检测框作为提示输入SAM，即可获得实例级别的分割掩码。

### 6.3 语义分割

将文本类别名称作为提示，SAM可以实现zero-shot语义分割，无需任何针对特定类别的训练。

### 6.4 交互式分割

SAM支持实时的交互式分割。用户通过点击指定目标，模型实时更新分割结果。这种交互范式在图像编辑和标注工具中具有重要应用价值。

## 7. 优势与局限性

### 7.1 优势

- **统一的模型架构**：单一模型处理多种分割任务
- **强大的zero-shot能力**：可迁移到未见过的新类别和新场景
- **实时交互性**：图像编码器仅需运行一次，支持高频交互
- **灵活的可扩展性**：可根据需求替换不同规模的图像编码器

### 7.2 局限性

- **细小物体分割**：对于薄小物体（如绳子、栅栏等），分割效果不佳
- **文本提示依赖CLIP**：文本理解的语义能力受限于CLIP的表现
- **模糊性处理**：当提示高度模糊时，输出可能不够理想
- **计算资源需求**：大型ViT模型需要较高的GPU内存和计算资源

## 8. 学术贡献与影响

SAM的学术贡献主要体现在以下几个方面：

1. **任务定义的创新**：通过SA Task统一了多样化的分割需求，证明了通用任务定义的重要性
2. **数据飞轮效应**：提出了模型-数据协同迭代的标注范式
3. **开源生态建设**：发布了SAM 2和SA-1B数据集，推动了领域快速发展
4. **多模态融合的探索**：将NLP中的prompting范式成功迁移到计算机视觉

SAM的出现标志着图像分割进入了一个新的时代，为后续的Segment Anything Model 2（SAM 2）等工作奠定了基础。
