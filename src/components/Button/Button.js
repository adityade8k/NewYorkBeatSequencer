import { el } from '@utils/dom.js'
import './styles.css'

export function Button({
    label = "Click",
    onClick,
    variant = "default",
    disabled = false,
    className = '',
    type = 'buttton',
    attrs = {}
} = {}) {
    const classes = ['btn'];
    if (variant && variant !== 'default') classes.push(`btn--${variant}`)
    if (className) {
        if (Array.isArray(className)) classes.push(...className.filter(Boolean))
        else classes.push(className)
    }

    return el(
        'button',
        {
            class: classes.join(' '),
            type,
            disabled: disabled ? '' : null,
            onClick: onClick ? onClick : null,
            ...attrs 
        },
        label
    )
}