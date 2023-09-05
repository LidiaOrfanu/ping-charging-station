// import React, { useState } from 'react';
// import { UpdateStationNameRequest, updateStationName } from '../api';

// interface EditStationNameFormProps {
//     stationId: number;
//     initialName: string;
//     onSubmit: (newName: string) => void;
// }

// const EditStationNameForm: React.FC<EditStationNameFormProps> = ({
//     stationId,
//     initialName,
//     onSubmit
// }) => {
//     const [newName, setNewName] = useState(initialName);

//     const handleSave = async () => {
//         try {
//             const updateData: UpdateStationNameRequest = {
//                 name: newName,
//             };
//             await updateStationName(stationId, updateData);
//             onSubmit(newName);
//         } catch (error) {
//             console.error('Error updating station:', error);
//         }
//     };

//     return (
//         <div>
//             <input
//                 type="text"
//                 value={newName}
//                 onChange={(e) => setNewName(e.target.value)}
//             />
//             <button onClick={handleSave}>Save Name</button>
//         </div>
//     );
// };

// export default EditStationNameForm;
