const Button = (props) => {
  const { children, className, ...otherProps } = props;

  const defaultStyles = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";

  return (
    <button className={`${defaultStyles} ${className}`} {...otherProps}>
      {children}
    </button>
  );
}
export default Button
// 리액트 사용 jsx 파일, tailwindCSS 적용. className을 기본적으로 button className으로 넣되, 그 외 파일도 ...otherProps로 가져와서 넣어줌
