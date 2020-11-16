import React from 'react';
import './Button.css'

const Button = ({label, icon, title, type, bg, shadow, style, onClick}) => (
	<div className="Button" style={style? style : null}>
		<button 
			title={title? title : label}
			className="ButtonData" 
			style={shadow? {boxShadow: shadow} : null}
			type={type? type : 'button'}
			onClick={onClick? onClick : null}
			>{label}{icon && <span className="material-icons">{icon}</span>}
		</button>
	</div>
);

export default Button;