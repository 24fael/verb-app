import { useState } from 'react';
import Linkify from "linkify-react";

interface ExpandableTextProps {
text: string;
maxLength?: number;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, maxLength = 100 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    if (text.length <= maxLength) {
        return <Linkify as="p" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>{text}</Linkify>;
    }

    const linkifyOptions = {
        defaultProtocol: 'https',
        target: '_blank',
        rel: 'noopener noreferrer',
        className: 'text-blue-500 hover:underline',
    };

    return (
        <div>
        <Linkify options={linkifyOptions} as="p" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
            {isExpanded ? text : `${text.substring(0, maxLength)}...`}
            <button onClick={toggleExpand} className="text-secondary hover:underline ml-1">
            {isExpanded ? 'See less' : 'See more'}
            </button>
        </Linkify>
        </div>
    );
};

export default ExpandableText;
