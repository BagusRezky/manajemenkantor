<?php

namespace App\Http\Controllers;

use App\Models\customerAddress;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerAddressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customerAddresses = customerAddress::all();
        return inertia::render('customerAddress/customerAddresses', [
            'customerAddresses' => $customerAddresses,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'kode_customer' => 'required',
            'nama_customer' => 'required',
            'alamat_lengkap' => 'required',
            'alamat_kedua' => 'nullable|string',
            'alamat_ketiga' => 'nullable|string',
        ]);

        $validated['kode_customer'] = strtoupper($validated['kode_customer']);
        $validated['nama_customer'] = strtoupper($validated['nama_customer']);

        customerAddress::create($validated);
        return redirect()->back()->with('success', 'Customer Address added successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return customerAddress::findOrFail($id);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(customerAddress $customerAddress)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $customerAddress = customerAddress::findOrFail($id);
        $validated = $request->validate([
            'kode_customer' => 'required',
            'nama_customer' => 'required',
            'alamat_lengkap' => 'required',
            'alamat_kedua' => 'nullable|string',
            'alamat_ketiga' => 'nullable|string',
        ]);

        $validated['kode_customer'] = strtoupper($validated['kode_customer']);
        $validated['nama_customer'] = strtoupper($validated['nama_customer']);

        $customerAddress->update($validated);
        return redirect()->back()->with('success', 'Customer Address updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $customerAddress = customerAddress::findOrFail($id);
        $customerAddress->delete();
        return redirect()->back()->with('success', 'Customer Address deleted successfully!');
    }
}
