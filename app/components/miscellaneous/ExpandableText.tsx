import { useState, useEffect } from 'react';
import Linkify from "linkify-react";

interface ExpandableTextProps {
    text: string;
    maxLength?: number;
    taskIsCompleted: boolean;
}

// Utility function to strip HTML tags
const stripHTML = (html: string): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
};

// Utility function to truncate HTML without breaking tags
const truncateHTML = (html: string, maxLength: number): string => {
    const div = document.createElement('div');
    div.innerHTML = html;
    let textContent = "";
    const walker = document.createTreeWalker(div, NodeFilter.SHOW_TEXT, null);
    let currentNode = walker.nextNode();
    let length = 0;
    
    // Checks each character in the text to make sure the 'see more' link shows up properly
    while (currentNode && length < maxLength) {
        const remainingLength = maxLength - length;
        if (currentNode.nodeValue!.length <= remainingLength) {
            textContent += currentNode.nodeValue;
            length += currentNode.nodeValue!.length;
        } else {
            textContent += currentNode.nodeValue!.substring(0, remainingLength);
            length = maxLength;
        }
        currentNode = walker.nextNode();
    }

    return length < maxLength ? html : div.innerHTML.substring(0, div.innerHTML.indexOf(textContent) + textContent.length) + "...";
};

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, maxLength = 100, taskIsCompleted }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [shouldShowToggle, setShouldShowToggle] = useState(false);

    const linkifyOptions = {
        defaultProtocol: 'https',
        target: '_blank',
        rel: 'noopener noreferrer',
        className: 'text-blue-500 hover:underline',
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        const plainText = stripHTML(text);
        setShouldShowToggle(plainText.length > maxLength);
    }, [text, maxLength]);

    // Check if the text contains HTML tags
    const containsHTML = /<\/?[a-z][\s\S]*>/i.test(text);

    if (containsHTML) {
        // If text contains HTML, render it as HTML

        // Encapsulate URLs within <li> tags in anchor tags
        const encapsulatedHTML = text.replace(/(https?:\/\/[^\s<>]+)/g, (match) => {
            return `<a href="${match}" class="text-blue-500 hover:underline" target="_blank">${match}</a>`;
        });

        const truncatedHTML = truncateHTML(encapsulatedHTML, maxLength);

        return (
            <div>
                <div dangerouslySetInnerHTML={{ __html: isExpanded ? encapsulatedHTML : truncatedHTML }} className={taskIsCompleted ? "line-through" : ""} />
                {/* Add toggle button for expanding */}
                {shouldShowToggle && (
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
            <Linkify options={linkifyOptions} as="p" className={taskIsCompleted ? "line-through" : ""} style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
                {text}
            </Linkify>
        );
    }

    // Truncate the text if it exceeds maxLength
    const truncatedText = isExpanded ? text : `${text.substring(0, maxLength)}...`;

    return (
        <div>
            <Linkify options={linkifyOptions} as="p" className={taskIsCompleted ? "line-through" : ""} style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
                {truncatedText}
            </Linkify>
            {/* Add toggle button for expanding */}
            {shouldShowToggle && (
                <button onClick={toggleExpand} className="text-secondary hover:underline ml-1">
                    {isExpanded ? 'See less' : 'See more'}
                </button>
            )}
        </div>
    );
};

export default ExpandableText;
