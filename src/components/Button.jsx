const Button = ({title, functionality}) => {
    return(
        <button onClick={functionality} className="submit-btn">{title}</button>
    )
}
export default Button