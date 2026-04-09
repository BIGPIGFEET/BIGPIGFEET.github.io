# Attention Is All You Need

> 论文：Vaswani et al., 2017

## 概述

Transformer 是第一个完全基于注意力机制的序列转导模型，摒弃了传统的 RNN 和 CNN 结构。

## 核心组件

### Self-Attention

自注意力机制通过三个权重矩阵将输入转换为 Q、K、V：

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V
$$

### Multi-Head Attention

多个注意力头并行工作，捕捉不同子空间的信息：

$$
\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \ldots, \text{head}_h)W^O
$$

## 架构特点

- **并行计算**：相比 RNN 大幅提升训练效率
- **全局感受野**：每个位置都能直接关注到序列中的任意其他位置
- **可解释性**：注意力权重可以直观展示词之间的关系

## 参考

- [论文原文](https://arxiv.org/abs/1706.03762)
