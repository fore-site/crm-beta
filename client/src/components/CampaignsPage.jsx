import React, { useState } from 'react';
import { Mail, MessageSquare, Send as SendIcon } from 'lucide-react';

const EmailPreview = ({ allContacts, campaign }) => (
    <div className="border border-gray-300 rounded-xl overflow-hidden bg-gray-50 shadow-lg h-full">
        <div className="bg-gray-200 p-4 text-sm border-b border-gray-300 text-gray-700 font-bold flex items-center justify-between">
            Email Preview <Mail className="w-4 h-4" />
        </div>
        <div className="p-6 space-y-4">
            <p className="text-xs font-medium text-gray-500">
                To: All Contacts ({allContacts.length})
            </p>
            <h4 className="text-base font-bold text-gray-900 border-b pb-2">
                Subject: {campaign.subject || '[No Subject Entered]'}
            </h4>
            {campaign.imageUrl && (
                <img
                    src={campaign.imageUrl}
                    alt="Email attachment preview"
                    className="w-full max-h-48 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                            'https://placehold.co/400x150/ef4444/ffffff?text=Image+Load+Failed';
                    }}
                />
            )}
            <p className="whitespace-pre-wrap text-gray-800 text-sm leading-relaxed">
                {campaign.bodyEmail ||
                    'The body of your email campaign will appear here. Use [Contact Name] for personalization.'}
            </p>
            <div className="text-center text-xs text-gray-400 pt-4">
                --- Footer/Unsubscribe Link ---
            </div>
        </div>
    </div>
);

const SmsPreview = ({ campaign }) => (
    <div className="border border-gray-300 rounded-xl overflow-hidden bg-gray-50 shadow-lg h-full">
        <div className="bg-gray-200 p-4 text-sm border-b border-gray-300 text-gray-700 font-bold flex items-center justify-between">
            SMS Preview <MessageSquare className="w-4 h-4" />
        </div>
        <div className="p-6 flex justify-center items-center h-full">
            <div className="w-64 border-8 border-gray-900 rounded-[3rem] p-2 bg-black shadow-2xl">
                <div className="bg-white h-96 rounded-[2.5rem] p-4 flex flex-col items-start space-y-2">
                    <div className="w-full flex justify-between text-xs text-gray-600 mb-2">
                        <span>Carrier</span>
                        <span>9:41 AM</span>
                    </div>
                    <div className="max-w-[85%] bg-[#E7F7EB] p-3 rounded-xl rounded-bl-none shadow-sm ml-auto">
                        <p className="text-xs whitespace-pre-wrap text-gray-800">
                            {campaign.bodySms ||
                                'Your SMS will appear here. Keep it concise. (Image not supported)'}
                        </p>
                    </div>
                    {campaign.imageUrl && (
                        <p className="text-red-500 text-xs mt-2 font-medium text-center w-full">
                            (Image URL ignored for SMS)
                        </p>
                    )}
                </div>
            </div>
        </div>
    </div>
);

export default function CampaignsPage({ allContacts }) {
    const [campaign, setCampaign] = useState({
        name: '',
        subject: '',
        bodyEmail:
            'Hi [Contact Name], we hope you are having a great day! Check out our latest offer.\n\nThanks,\n[Admin Name]',
        bodySms:
            'Hi [Contact Name], check out our latest offer. Reply STOP to unsubscribe.',
        imageUrl: '',
    });
    const [isSending, setIsSending] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCampaign((prev) => ({ ...prev, [name]: value }));
    };

    const handleSend = () => {
        if (
            !campaign.name ||
            !campaign.subject ||
            !campaign.bodyEmail ||
            !campaign.bodySms
        ) {
            console.error(
                'Validation failed: Please fill out all required fields.'
            );
            window.alert(
                'Please fill out Name, Subject, Email Body, and SMS Body before sending.'
            );
            return;
        }
        setIsSending(true);
        console.log(
            `Sending campaign "${campaign.name}" to ${allContacts.length} contacts...`
        );
        console.log('Campaign Details:', campaign);
        setTimeout(() => {
            setIsSending(false);
            window.alert(
                `SUCCESS! Campaign "${campaign.name}" simulated send to ${allContacts.length} contacts.`
            );
            setCampaign({
                name: '',
                subject: '',
                bodyEmail: '',
                bodySms: '',
                imageUrl: '',
            });
        }, 2000);
    };

    return (
        <div className="space-y-8">
            <div className="p-4 border-l-4 border-[#26A248] bg-[#E7F7EB] rounded-lg shadow-md">
                <p className="font-semibold text-gray-800">
                    Target Audience: All Contacts ({allContacts.length})
                </p>
                <p className="text-sm text-gray-600">
                    The current campaign will be sent in bulk to every contact
                    and lead loaded in the app.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <h3 className="text-2xl font-bold text-[#130F0F] mb-6">
                        Campaign Details
                    </h3>
                    <div className="space-y-5">
                        <div>
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Campaign Name (Internal)
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={campaign.name}
                                onChange={handleChange}
                                placeholder="e.g., Q1 Welcome Offer"
                                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-[#26A248] focus:border-[#26A248] transition duration-150"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="subject"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email Subject Line
                            </label>
                            <input
                                type="text"
                                name="subject"
                                id="subject"
                                value={campaign.subject}
                                onChange={handleChange}
                                placeholder="e.g., Don't Miss Out! Exclusive 20% Discount Inside"
                                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-[#26A248] focus:border-[#26A248] transition duration-150"
                                required
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="imageUrl"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Image URL (Optional, for Email)
                            </label>
                            <input
                                type="url"
                                name="imageUrl"
                                id="imageUrl"
                                value={campaign.imageUrl}
                                onChange={handleChange}
                                placeholder="https://example.com/promo-image.jpg"
                                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Note: Use a public image link. Direct file
                                uploads are complex and often fail in real email
                                clients.
                            </p>
                        </div>

                        <div>
                            <label
                                htmlFor="bodyEmail"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email Body Content
                            </label>
                            <textarea
                                name="bodyEmail"
                                id="bodyEmail"
                                value={campaign.bodyEmail}
                                onChange={handleChange}
                                rows="6"
                                placeholder="Write your full email content here. Use [Contact Name] for personalization."
                                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-[#26A248] focus:border-[#26A248] transition duration-150"
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label
                                htmlFor="bodySms"
                                className="block text-sm font-medium text-gray-700"
                            >
                                SMS Body Content
                            </label>
                            <textarea
                                name="bodySms"
                                id="bodySms"
                                value={campaign.bodySms}
                                onChange={handleChange}
                                rows="3"
                                maxLength="320"
                                placeholder="Keep it short and concise for SMS. Max 320 characters."
                                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-[#26A248] focus:border-[#26A248] transition duration-150"
                                required
                            ></textarea>
                            <p className="text-xs text-gray-500 mt-1">
                                Characters: {campaign.bodySms.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <h3 className="text-2xl font-bold text-[#130F0F]">
                        Live Previews
                    </h3>
                    <EmailPreview
                        allContacts={allContacts}
                        campaign={campaign}
                    />
                    <SmsPreview campaign={campaign} />
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
                <button
                    onClick={handleSend}
                    disabled={isSending}
                    className="flex items-center p-4 rounded-xl bg-[#26A248] text-white text-lg font-bold shadow-xl hover:bg-[#1F813A] transition-all duration-200 transform hover:scale-[1.01] disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isSending ? (
                        <>
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Sending...
                        </>
                    ) : (
                        <>
                            <SendIcon className="h-6 w-6 mr-3" />
                            Send Campaign to {allContacts.length} Contacts
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
