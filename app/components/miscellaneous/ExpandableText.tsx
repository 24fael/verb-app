import { useState } from 'react';
import Linkify from "linkify-react";

interface ExpandableTextProps {
    text: string;
    maxLength?: number;
    taskIsCompleted: boolean;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, maxLength = 100, taskIsCompleted }) => {
const [isExpanded, setIsExpanded] = useState(false);

const linkifyOptions = {
    defaultProtocol: 'https',
    target: '_blank',
    rel: 'noopener noreferrer',
    className: 'text-blue-500 hover:underline',
};

const toggleExpand = () => {
    setIsExpanded(!isExpanded);
};

// Check if the text contains HTML tags
const containsHTML = /<\/?[a-z][\s\S]*>/i.test(text);

if (containsHTML) {
    // If text contains HTML, render it as HTML

    // Checks URLs within <li> tags and encapsulates them in anchor tags
    const encapsulatedHTML = text.replace(/(https?:\/\/[^\s<>]+)/g, (match) => {
        return `<a href="${match}" class="text-blue-500 hover:underline" target="_blank">${match}</a>`;
    });

    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: encapsulatedHTML }} className={taskIsCompleted ? "line-through": ""} />
            {/* Add toggle button for expanding */}
            {text.replace(/(<([^>]+)>)/ig, "").length > maxLength && (
                <button onClick={toggleExpand} className="text-secondary hover:underline ml-1">
                    {isExpanded ? 'See less' : 'See more'}
                </button>
            )}
        </div>
    );

}

// If text does not contain HTML, render it with Linkify and add expand functionality
if (text.length <= maxLength) {
    return (
    <Linkify options={linkifyOptions} as="p" className={taskIsCompleted ? "line-through": ""} style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
        {text}
    </Linkify>
    );
}

// Truncate the text if it exceeds maxLength, excluding HTML tags from the count
const truncatedText = isExpanded ? text : `${text.substring(0, maxLength)}...`;

return (
    <div>
    <Linkify options={linkifyOptions} as="p" className={taskIsCompleted ? "line-through": ""} style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
        {truncatedText}
    </Linkify>
    {/* Add toggle button for expanding */}
    <button onClick={toggleExpand} className="text-secondary hover:underline ml-1">
        {isExpanded ? 'See less' : 'See more'}
    </button>
    </div>
);
};

export default ExpandableText;
