const Messages = [
  {
    id: 1,
    createdOn: new Date(),
    subject: 'Andela Fellowship',
    message: 'Congratulation, you made it into the Andela Fellowship Program',
    senderId: 1,
    receiverId: 2,
    parentMessageId: 1,
    status: 'read',
  },
  {
    id: 2,
    createdOn: new Date(),
    subject: 'Udacity Mentor Program',
    message: 'As an Alumni of Udacity, you are invited to apply',
    senderId: 2,
    receiverId: 3,
    parentMessageId: 2,
    status: 'draft',
  },
  {
    id: 3,
    createdOn: new Date(),
    subject: 'PayStack Careers',
    message: 'We have a career opening for Technical Support Champion',
    senderId: 3,
    receiverId: 3,
    parentMessageId: 3,
    status: 'sent',
  },
  {
    id: 4,
    createdOn: new Date(),
    subject: 'Jumia Promo',
    message: 'Your account have just been credited with $1,000 shopping voucher',
    senderId: 4,
    receiverId: 3,
    parentMessageId: 3,
    status: 'unread',
  },
];

export default Messages;
