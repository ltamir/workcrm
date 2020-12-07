import React from 'react';
import './Button.css'

const Button = ({label, icon, title, type, bg, shadow, style, onClick, children}) => (
	<div className="Button" style={style? style : null}>
		<button 
			title={title? title : label}
			className="ButtonData" 
			style={shadow? {boxShadow: shadow} : null}
			type={type? type : 'button'}
			onClick={onClick? onClick : null}
			>{label}{icon && <span className="material-icons">{icon}</span>}
			{children}
		</button>
	</div>
);

export default Button;