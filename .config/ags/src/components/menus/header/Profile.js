import settings from '../../../settings/settings.js';

const Profile = () => {
    const userImage = Widget.Icon({
        className: 'profile-icon',
        icon: `${settings.profilePicture}`,
        size: 90,
    });

    const myName = Widget.Label({
        className: 'profile-label',
        label: settings.username,
    });

    return Widget.Box({
        className: 'profile-box',
        vertical: true,
        children: [userImage, myName],
    });
};

export default Profile;
