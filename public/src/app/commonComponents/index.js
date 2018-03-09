/**
 * 公共组件，这里放尽可能的抽象出可以复用的组件，不局限于业务，目标是开源出自己的一个UI库
 *
 * 注：这里有个坑，如果文件夹的目录为 common-components 这种以 - 分隔的形式，外部直接从 index.js 引入组件就会出问题
 * 推测是React不能机智的将 - 转换为驼峰
 *
 * Created by waka on 2017/3/30.
 */

export Avatar from './Avatar/Avatar';	// 头像
export Button from './Button/Button';	// 按钮
export CheckBoxButtons from './CheckBoxButtons/CheckBoxButtons';	// 多选框
export DatePicker from './DatePicker/DatePicker';	// 日期选择框
export FormItem from './Form/FormItem/FormItem';	// 表单项
export Input from './Input/Input';	// 输入框
export Modal from './Modal/Modal';	// 模态对话框
export MultiSelect from './MultiSelect/MultiSelect';	// 多选框控件
export Pagination from './Pagination/Pagination';	// 分页栏
export Radio from './Radio/Radio';	// 单选按钮
export RadioGroup from './RadioGroup/RadioGroup';	// 单选按钮组
export Rate from './Rate/Rate';	// 评分组件
export SearchBar from './SearchBar/SearchBar';	// 搜索框
export Spin from './Spin/Spin';	// 加载中
export TabGroup from './TabGroup/TabGroup';	// Tab组
export TabItem from './TabItem/TabItem';	// Tab项
export Textarea from './Textarea/Textarea';	// 文本域
