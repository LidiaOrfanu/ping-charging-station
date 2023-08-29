// import React, { useState } from 'react';

// interface EditStationNameFormProps {
//   stationId: number;
//   initialName: string;
//   onSave: (newName: string) => void;
// }

// const EditStationNameForm: React.FC<EditStationNameFormProps> = ({
//   stationId,
//   initialName,
//   onSave
// }) => {
//   const [newName, setNewName] = useState(initialName);

//   const handleSave = async () => {
//     try {
//       await updateStationName(stationId, newName);
//       onSave(newName);
//     } catch (error) {
//       console.error('Error updating station name:', error);
//     }
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         value={newName}
//         onChange={(e) => setNewName(e.target.value)}
//       />
//       <button onClick={handleSave}>Save Name</button>
//     </div>
//   );
// };

// export default EditStationNameForm;
