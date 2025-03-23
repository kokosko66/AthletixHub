export default function Dialog({isOpen, onClose, children}) {
    if(!isOpen) return null
    return(
        <div className="dialog-overlay" onClick={onClose}>
            <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
    );
}