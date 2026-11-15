# PEMFC 剩余寿命预测终端

本仓库收录毛炯原有 Streamlit 终端的界面美化版，以及供交流使用的 FC1 浏览器演示。

- [完整 Streamlit 版](dc-zhongduan/README.md)支持导入数据、运行预测、调整阈值和保存结果。Community Cloud 部署入口为 `dc-zhongduan/public_app.py`。
- [FC1 在线演示](https://pemfc-fc1-redesign.lustrouskelp3.chatgpt.site/)使用预先计算的公开电堆数据，可调整阈值和导出 CSV。演示源码在 `demo/`。

完整版本在 Python 3.11 环境下进入 `dc-zhongduan/`，安装 `requirements.txt`，再运行 `streamlit run app.py`。

原始项目为 [liuqi-89/zhizimo](https://github.com/liuqi-89/zhizimo/tree/05eddb12116688e8bbd80cf6b26fb6b463bca887)。FC1 来源为 [IEEE PHM 2014 数据集](https://repository.lboro.ac.uk/articles/dataset/IEEE_2014_Data_Challenge_Data/3518141)。网页显示的是电堆电压和设定阈值下的模型外推。界面设计参考 [Unslop by Damir Sokolovsky](https://heydamir.design/unslop)。
