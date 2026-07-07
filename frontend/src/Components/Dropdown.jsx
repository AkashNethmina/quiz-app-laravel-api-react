import { useState, createContext, useContext, Fragment } from 'react';

const DropDownContext = createContext();

const Dropdown = ({ children }) => {
    const [open, setOpen] = useState(false);

    const toggleOpen = () => {
        setOpen((previousState) => !previousState);
    };

    return (
        <DropDownContext.Provider value={{ open, setOpen, toggleOpen }}>
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { open, setOpen, toggleOpen } = useContext(DropDownContext);

    return (
        <>
            <div onClick={toggleOpen} className="cursor-pointer">{children}</div>

            {open && <div className="fixed inset-0 z-40" onClick={() => setOpen(false)}></div>}
        </>
    );
};

const Content = ({ align = 'right', width = '48', contentClasses = 'py-1.5 bg-white', children }) => {
    const { open, setOpen } = useContext(DropDownContext);

    let alignmentClasses = 'origin-top';

    if (align === 'left') {
        alignmentClasses = 'ltr:origin-top-left rtl:origin-top-right start-0';
    } else if (align === 'right') {
        alignmentClasses = 'ltr:origin-top-right rtl:origin-top-left end-0';
    }

    let widthClasses = '';

    if (width === '48') {
        widthClasses = 'w-48';
    }

    return (
        <>
            {open && (
                <div
                    className={`absolute z-50 mt-2 rounded-xl shadow-xl border border-gray-100/80 animate-fade-in ${alignmentClasses} ${widthClasses}`}
                    onClick={() => setOpen(false)}
                >
                    <div className={`rounded-xl ring-1 ring-black/5 glass-panel ${contentClasses}`}>
                        {children}
                    </div>
                </div>
            )}
        </>
    );
};

const Link = ({ className = '', children, ...props }) => {
    return (
        <button
            {...props}
            type="button"
            className={
                'block w-full px-4 py-2.5 text-start text-sm leading-5 text-gray-700 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out font-medium ' +
                className
            }
        >
            {children}
        </button>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = Link;

export default Dropdown;
