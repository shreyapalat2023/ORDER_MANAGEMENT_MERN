import CustomerPO from "../models/customerPo.model.js";

export const create = async (req, res) => {
    try {
        const { poNumber, customer, date, status, items } = req.body;

        // Validation
        if (!poNumber || !customer || !date || !status) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const totalAmount = items?.reduce((total, item) => {
            return total + (parseFloat(item.salesPrice) || 0);
        }, 0);


        // Step 1: Create new instance
        const customerPo = new CustomerPO({
            poNumber,
            customer,
            date,
            status,
            items,
            totalAmount
        });

        // Step 2: Save it
        const savedCustomerPo = await customerPo.save();

        // Step 3: Populate
        const populatedCustomerPo = await CustomerPO.findById(savedCustomerPo._id).populate("customer", "name").populate("items.item","name");

        res.status(201).json({
            message: "CustomerPO added successfully",
            customerPo: populatedCustomerPo,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};

//list

export const list = async (req, res) => {
    try {

        const custpmerPos = await CustomerPO.find({}).sort({ createdAt: -1 }).populate("customer", "name").populate("items.item","name");
        if (!custpmerPos) res.status(400).json({ error: "customerPo not found" })
        res.json(custpmerPos)

    } catch (error) {
        console.log(error);

        res.status(500).json({ error: "server Error" })
    }
}

//update 
export const update = async (req, res) => {
    try {
        const { poNumber, customer, date, status, items } = req.body;
        const { id } = req.params;
        console.log("Received ID:", id);

        const totalAmount = items?.reduce((total, item) => {
            return total + (parseFloat(item.salesPrice) || 0);
        }, 0);


        // Validation
        if (!poNumber || !customer || !date || !status) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Update document
        const updatedPO = await CustomerPO.findByIdAndUpdate(
            id,
            { poNumber, customer, date, status, items, totalAmount },
            { new: true }
        ).populate("customer", "name").populate("items.item","name");

        if (!updatedPO) {
            return res.status(404).json({ error: "Customer PO not found" });
        }

        res.status(200).json({ message: "Updated Successfully", customerPo: updatedPO });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};


//remove

export const remove = async (req, res) => {
    try {
        const removed = await CustomerPO.findByIdAndDelete(req.params.id);
        res.status(201).json({
            message: "CustomerPO deleted successfully",
            removed,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({ error: "server Error" })
    }

}
